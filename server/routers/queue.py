"""
Queue router – the core of Smart FairQueue.
Handles: patient registration, token issuance, queue tracking,
         staff actions (call next, complete, emergency priority),
         public display, audit log, stats.
"""
from __future__ import annotations
import json
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from ..database import get_db
from ..models import Patient, QueueToken, QueueEvent, AuditLog, Department, HealthcareFacility
from ..auth import decode_token
from ..schemas import (
    PatientRegisterRequest, QueueTokenOut, QueueStatusOut,
    CallNextRequest, MarkCompleteRequest, EmergencyPriorityRequest,
    CancelTokenRequest, AuditLogOut, QueueStatsOut
)
from ..websocket_manager import manager

router = APIRouter(prefix="/queue", tags=["Smart FairQueue"])


# ─── helpers ────────────────────────────────────────────────────────────────

def _now():
    return datetime.now(timezone.utc)


def _get_staff(authorization: Optional[str]) -> Optional[str]:
    """Extract staff user_id from Bearer token, or return None for self-service."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    payload = decode_token(authorization[7:])
    return payload.get("sub") if payload else None


async def _get_dept(db: AsyncSession, dept_id: str) -> Department:
    result = await db.execute(select(Department).where(Department.id == dept_id))
    dept = result.scalars().first()
    if not dept:
        raise HTTPException(404, "Department not found")
    return dept


async def _next_sequence(db: AsyncSession, facility_id: str, dept_id: str) -> int:
    """Get next sequence number for the day (resets at midnight)."""
    today_start = _now().replace(hour=0, minute=0, second=0, microsecond=0)
    result = await db.execute(
        select(func.max(QueueToken.sequence_number)).where(
            and_(
                QueueToken.facility_id == facility_id,
                QueueToken.department_id == dept_id,
                QueueToken.registered_at >= today_start,
            )
        )
    )
    max_seq = result.scalar()
    return (max_seq or 0) + 1


async def _queue_position(db: AsyncSession, token: QueueToken) -> int:
    """How many WAITING tokens are ahead of this token in the same dept."""
    result = await db.execute(
        select(func.count()).where(
            and_(
                QueueToken.department_id == token.department_id,
                QueueToken.status == "WAITING",
                QueueToken.priority == "NORMAL",
                QueueToken.sequence_number < token.sequence_number,
            )
        )
    )
    return (result.scalar() or 0)


async def _token_to_out(db: AsyncSession, token: QueueToken) -> QueueTokenOut:
    """Build a QueueTokenOut from a QueueToken ORM object."""
    dept_result = await db.execute(select(Department).where(Department.id == token.department_id))
    dept = dept_result.scalars().first()
    patient_result = await db.execute(select(Patient).where(Patient.id == token.patient_id))
    patient = patient_result.scalars().first()

    position = await _queue_position(db, token) if token.status == "WAITING" else 0
    est_wait = position * 8 if position > 0 else None  # ~8 min per patient

    return QueueTokenOut(
        id=token.id,
        token_number=token.token_number,
        patient_id=token.patient_id,
        patient_name=patient.name if patient else "Unknown",
        facility_id=token.facility_id,
        department_id=token.department_id,
        department_name=dept.name if dept else "Unknown",
        sequence_number=token.sequence_number,
        status=token.status,
        priority=token.priority,
        priority_reason=token.priority_reason,
        registered_at=token.registered_at,
        called_at=token.called_at,
        completed_at=token.completed_at,
        queue_position=position,
        tokens_ahead=position,
        estimated_wait_minutes=est_wait,
    )


async def _write_audit(
    db: AsyncSession,
    staff_id: Optional[str],
    action: str,
    entity_type: str,
    entity_id: str,
    before: Optional[dict] = None,
    after: Optional[dict] = None,
    reason: Optional[str] = None,
    flag: bool = False,
):
    audit = AuditLog(
        staff_id=staff_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        before_state=json.dumps(before) if before else None,
        after_state=json.dumps(after) if after else None,
        reason=reason,
        flagged=flag,
    )
    db.add(audit)


# ─── Patient Registration ────────────────────────────────────────────────────

@router.post("/register", response_model=QueueTokenOut, status_code=201)
async def register_patient(
    req: PatientRegisterRequest,
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    """
    Register a new patient and issue a queue token.
    Works for self-registration, ASHA worker, and receptionist.
    Handles offline duplicates via offline_id.
    """
    # Deduplication: if offline_id already in DB, return existing token
    if req.offline_id:
        existing = await db.execute(
            select(QueueToken).where(QueueToken.offline_id == req.offline_id)
        )
        existing_token = existing.scalars().first()
        if existing_token:
            return await _token_to_out(db, existing_token)

    # Validate department exists
    dept = await _get_dept(db, req.department_id)

    # Create patient record
    patient = Patient(
        name=req.name,
        age=req.age,
        gender=req.gender,
        mobile=req.mobile,
        preferred_language=req.preferred_language,
        registered_by=req.registered_by,
        registered_by_staff_id=req.registered_by_staff_id,
    )
    db.add(patient)
    await db.flush()  # Get patient.id

    # Generate sequence number and token number
    seq = await _next_sequence(db, req.facility_id, req.department_id)
    token_number = f"{dept.code}-{seq:03d}"

    token = QueueToken(
        token_number=token_number,
        patient_id=patient.id,
        facility_id=req.facility_id,
        department_id=req.department_id,
        sequence_number=seq,
        status="WAITING",
        priority="NORMAL",
        offline_id=req.offline_id,
        is_offline_generated=bool(req.offline_id),
    )
    db.add(token)
    await db.flush()

    # Queue event
    event = QueueEvent(
        token_id=token.id,
        event_type="REGISTERED",
        to_status="WAITING",
        performed_by=req.registered_by_staff_id or "SELF",
        notes=f"Registered via {req.registered_by}",
    )
    db.add(event)

    # Audit log
    staff_id = _get_staff(authorization) or req.registered_by_staff_id
    await _write_audit(
        db, staff_id, "PATIENT_REGISTERED", "QueueToken", token.id,
        after={"token": token_number, "method": req.registered_by},
    )

    await db.commit()
    await db.refresh(token)

    out = await _token_to_out(db, token)

    # Broadcast to WebSocket watchers
    await manager.broadcast_to_room(req.department_id, {
        "event": "NEW_TOKEN",
        "department_id": req.department_id,
        "token_number": token_number,
        "total_waiting": out.tokens_ahead + 1,
    })

    return out


# ─── Token Lookup ────────────────────────────────────────────────────────────

@router.get("/token/{token_id}", response_model=QueueTokenOut)
async def get_token(token_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(QueueToken).where(QueueToken.id == token_id))
    token = result.scalars().first()
    if not token:
        raise HTTPException(404, "Token not found")
    return await _token_to_out(db, token)


@router.get("/token-by-number", response_model=QueueTokenOut)
async def get_token_by_number(
    number: str = Query(...),
    dept_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    today_start = _now().replace(hour=0, minute=0, second=0, microsecond=0)
    result = await db.execute(
        select(QueueToken).where(
            and_(
                QueueToken.token_number == number,
                QueueToken.department_id == dept_id,
                QueueToken.registered_at >= today_start,
            )
        )
    )
    token = result.scalars().first()
    if not token:
        raise HTTPException(404, "Token not found")
    return await _token_to_out(db, token)


# ─── Queue Status (public – no patient names) ────────────────────────────────

@router.get("/status/{department_id}", response_model=QueueStatusOut)
async def queue_status(department_id: str, db: AsyncSession = Depends(get_db)):
    """Public-safe queue status for a department."""
    dept = await _get_dept(db, department_id)

    fac_result = await db.execute(
        select(HealthcareFacility).where(HealthcareFacility.id == dept.facility_id)
    )
    facility = fac_result.scalars().first()

    today_start = _now().replace(hour=0, minute=0, second=0, microsecond=0)

    # Currently serving (IN_CONSULTATION)
    serving_result = await db.execute(
        select(QueueToken).where(
            and_(
                QueueToken.department_id == department_id,
                QueueToken.status == "IN_CONSULTATION",
                QueueToken.registered_at >= today_start,
            )
        ).order_by(QueueToken.called_at.desc()).limit(1)
    )
    serving = serving_result.scalars().first()

    # Next 3 waiting
    next_result = await db.execute(
        select(QueueToken).where(
            and_(
                QueueToken.department_id == department_id,
                QueueToken.status == "WAITING",
                QueueToken.registered_at >= today_start,
            )
        ).order_by(QueueToken.priority.desc(), QueueToken.sequence_number).limit(3)
    )
    next_tokens = next_result.scalars().all()

    # Counts
    waiting_count = await db.execute(
        select(func.count()).where(
            and_(
                QueueToken.department_id == department_id,
                QueueToken.status == "WAITING",
                QueueToken.registered_at >= today_start,
            )
        )
    )
    completed_count = await db.execute(
        select(func.count()).where(
            and_(
                QueueToken.department_id == department_id,
                QueueToken.status == "COMPLETED",
                QueueToken.registered_at >= today_start,
            )
        )
    )

    return QueueStatusOut(
        department_id=department_id,
        department_name=dept.name,
        facility_name=facility.name if facility else "",
        currently_serving=serving.token_number if serving else None,
        next_tokens=[t.token_number for t in next_tokens],
        total_waiting=waiting_count.scalar() or 0,
        total_completed=completed_count.scalar() or 0,
    )


# ─── Department Queue List (staff) ───────────────────────────────────────────

@router.get("/list/{department_id}", response_model=List[QueueTokenOut])
async def list_queue(
    department_id: str,
    status_filter: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    """Full queue list for staff. Requires authorization."""
    if not _get_staff(authorization):
        raise HTTPException(401, "Staff authorization required")

    today_start = _now().replace(hour=0, minute=0, second=0, microsecond=0)
    conditions = [
        QueueToken.department_id == department_id,
        QueueToken.registered_at >= today_start,
    ]
    if status_filter:
        conditions.append(QueueToken.status == status_filter)

    result = await db.execute(
        select(QueueToken).where(and_(*conditions))
        .order_by(QueueToken.priority.desc(), QueueToken.sequence_number)
    )
    tokens = result.scalars().all()
    return [await _token_to_out(db, t) for t in tokens]


# ─── Stats (staff) ───────────────────────────────────────────────────────────

@router.get("/stats/{department_id}", response_model=QueueStatsOut)
async def queue_stats(
    department_id: str,
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    if not _get_staff(authorization):
        raise HTTPException(401, "Staff authorization required")

    today_start = _now().replace(hour=0, minute=0, second=0, microsecond=0)

    async def _count(status):
        r = await db.execute(
            select(func.count()).where(
                and_(
                    QueueToken.department_id == department_id,
                    QueueToken.status == status,
                    QueueToken.registered_at >= today_start,
                )
            )
        )
        return r.scalar() or 0

    total_reg = await db.execute(
        select(func.count()).where(
            and_(
                QueueToken.department_id == department_id,
                QueueToken.registered_at >= today_start,
            )
        )
    )
    serving_result = await db.execute(
        select(QueueToken).where(
            and_(
                QueueToken.department_id == department_id,
                QueueToken.status == "IN_CONSULTATION",
                QueueToken.registered_at >= today_start,
            )
        ).limit(1)
    )
    serving = serving_result.scalars().first()

    return QueueStatsOut(
        total_registered=total_reg.scalar() or 0,
        total_waiting=await _count("WAITING"),
        total_in_consultation=await _count("IN_CONSULTATION"),
        total_completed=await _count("COMPLETED"),
        currently_serving_token=serving.token_number if serving else None,
        avg_wait_minutes=8.0,  # Placeholder; real calc needs historical data
    )


# ─── Staff Actions ───────────────────────────────────────────────────────────

@router.post("/call-next")
async def call_next(
    req: CallNextRequest,
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    """Call the next patient in the queue (staff only)."""
    staff_id = _get_staff(authorization)
    if not staff_id:
        raise HTTPException(401, "Staff authorization required")

    today_start = _now().replace(hour=0, minute=0, second=0, microsecond=0)

    # Mark any IN_CONSULTATION tokens as COMPLETED first
    active_result = await db.execute(
        select(QueueToken).where(
            and_(
                QueueToken.department_id == req.department_id,
                QueueToken.status == "IN_CONSULTATION",
                QueueToken.registered_at >= today_start,
            )
        )
    )
    for active in active_result.scalars().all():
        active.status = "COMPLETED"
        active.completed_at = _now()
        event = QueueEvent(
            token_id=active.id, event_type="COMPLETED",
            from_status="IN_CONSULTATION", to_status="COMPLETED",
            performed_by=staff_id,
        )
        db.add(event)

    # Get next WAITING token (EMERGENCY first, then by sequence)
    next_result = await db.execute(
        select(QueueToken).where(
            and_(
                QueueToken.department_id == req.department_id,
                QueueToken.status == "WAITING",
                QueueToken.registered_at >= today_start,
            )
        ).order_by(
            QueueToken.priority.desc(),  # EMERGENCY before NORMAL
            QueueToken.sequence_number
        ).limit(1)
    )
    next_token = next_result.scalars().first()

    if not next_token:
        return {"message": "No more patients in queue", "token": None}

    before = {"status": "WAITING"}
    next_token.status = "CALLED"
    next_token.called_at = _now()

    call_event = QueueEvent(
        token_id=next_token.id, event_type="CALLED",
        from_status="WAITING", to_status="CALLED",
        performed_by=staff_id,
    )
    db.add(call_event)

    await _write_audit(
        db, staff_id, "TOKEN_CALLED", "QueueToken", next_token.id,
        before=before, after={"status": "CALLED", "token": next_token.token_number},
    )

    await db.commit()
    await db.refresh(next_token)

    out = await _token_to_out(db, next_token)

    # Broadcast to all watchers
    await manager.broadcast_to_room(req.department_id, {
        "event": "TOKEN_CALLED",
        "department_id": req.department_id,
        "token_number": next_token.token_number,
        "token_id": next_token.id,
    })

    return {"message": "Patient called", "token": out}


@router.post("/mark-in-consultation")
async def mark_in_consultation(
    token_id: str,
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    staff_id = _get_staff(authorization)
    if not staff_id:
        raise HTTPException(401, "Staff authorization required")

    result = await db.execute(select(QueueToken).where(QueueToken.id == token_id))
    token = result.scalars().first()
    if not token:
        raise HTTPException(404, "Token not found")

    token.status = "IN_CONSULTATION"
    event = QueueEvent(
        token_id=token.id, event_type="IN_CONSULTATION",
        from_status="CALLED", to_status="IN_CONSULTATION",
        performed_by=staff_id,
    )
    db.add(event)
    await db.commit()

    await manager.broadcast_to_room(token.department_id, {
        "event": "IN_CONSULTATION",
        "department_id": token.department_id,
        "token_number": token.token_number,
    })

    return {"message": "Marked as in consultation", "token_number": token.token_number}


@router.post("/mark-complete")
async def mark_complete(
    req: MarkCompleteRequest,
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    staff_id = _get_staff(authorization) or req.staff_id
    if not staff_id:
        raise HTTPException(401, "Staff authorization required")

    result = await db.execute(select(QueueToken).where(QueueToken.id == req.token_id))
    token = result.scalars().first()
    if not token:
        raise HTTPException(404, "Token not found")

    before = {"status": token.status}
    token.status = "COMPLETED"
    token.completed_at = _now()

    event = QueueEvent(
        token_id=token.id, event_type="COMPLETED",
        from_status=before["status"], to_status="COMPLETED",
        performed_by=staff_id, notes=req.notes,
    )
    db.add(event)

    await _write_audit(
        db, staff_id, "TOKEN_COMPLETED", "QueueToken", token.id,
        before=before, after={"status": "COMPLETED"},
    )

    await db.commit()

    await manager.broadcast_to_room(token.department_id, {
        "event": "TOKEN_COMPLETED",
        "department_id": token.department_id,
        "token_number": token.token_number,
    })

    return {"message": "Consultation marked complete"}


@router.post("/emergency-priority")
async def set_emergency_priority(
    req: EmergencyPriorityRequest,
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    """
    Set emergency priority.
    MANDATORY: reason field (min 10 chars).
    Records full audit trail. Cannot be done silently.
    """
    staff_id = _get_staff(authorization) or req.staff_id
    if not staff_id:
        raise HTTPException(401, "Staff authorization required")

    result = await db.execute(select(QueueToken).where(QueueToken.id == req.token_id))
    token = result.scalars().first()
    if not token:
        raise HTTPException(404, "Token not found")

    before = {"priority": token.priority, "status": token.status}
    token.priority = "EMERGENCY"
    token.priority_reason = req.reason

    event = QueueEvent(
        token_id=token.id, event_type="PRIORITY_CHANGED",
        from_status=f"NORMAL/{token.status}",
        to_status=f"EMERGENCY/{token.status}",
        performed_by=staff_id,
        notes=req.reason,
    )
    db.add(event)

    # Check for Queue Integrity Monitor: >3 emergency upgrades by same staff today
    today_start = _now().replace(hour=0, minute=0, second=0, microsecond=0)
    audit_count_result = await db.execute(
        select(func.count()).where(
            and_(
                AuditLog.staff_id == staff_id,
                AuditLog.action == "EMERGENCY_PRIORITY",
                AuditLog.logged_at >= today_start,
            )
        )
    )
    suspicious = (audit_count_result.scalar() or 0) >= 3

    await _write_audit(
        db, staff_id, "EMERGENCY_PRIORITY", "QueueToken", token.id,
        before=before,
        after={"priority": "EMERGENCY", "reason": req.reason},
        reason=req.reason,
        flag=suspicious,
    )

    await db.commit()

    await manager.broadcast_to_room(token.department_id, {
        "event": "PRIORITY_CHANGED",
        "department_id": token.department_id,
        "token_number": token.token_number,
        "priority": "EMERGENCY",
    })

    return {
        "message": "Emergency priority set",
        "flagged_for_review": suspicious,
        "token_number": token.token_number,
    }


# ─── Audit Log (admin) ───────────────────────────────────────────────────────

@router.get("/audit", response_model=List[AuditLogOut])
async def get_audit_log(
    department_id: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    if not _get_staff(authorization):
        raise HTTPException(401, "Staff authorization required")

    result = await db.execute(
        select(AuditLog).order_by(AuditLog.logged_at.desc()).limit(limit)
    )
    return result.scalars().all()
