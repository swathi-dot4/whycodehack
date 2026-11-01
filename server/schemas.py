"""
Pydantic schemas for request/response validation.
"""
from __future__ import annotations
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ──────── Auth ────────
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str


class LoginRequest(BaseModel):
    username: str
    password: str


# ──────── Facilities ────────
class FacilityOut(BaseModel):
    id: str
    name: str
    facility_type: str
    district: str
    city: str
    address: Optional[str] = None
    contact_number: Optional[str] = None

    class Config:
        from_attributes = True


class DepartmentOut(BaseModel):
    id: str
    facility_id: str
    name: str
    code: str

    class Config:
        from_attributes = True


# ──────── Patient registration ────────
class PatientRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    age: Optional[int] = Field(None, ge=0, le=130)
    gender: Optional[str] = None
    mobile: Optional[str] = None
    preferred_language: str = "en"
    registered_by: str = "SELF"           # SELF | ASHA_WORKER | RECEPTIONIST
    registered_by_staff_id: Optional[str] = None
    facility_id: str
    department_id: str
    offline_id: Optional[str] = None      # Client UUID for deduplication


class PatientOut(BaseModel):
    id: str
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    mobile: Optional[str] = None
    preferred_language: str
    registered_by: str
    created_at: datetime

    class Config:
        from_attributes = True


# ──────── Queue token ────────
class QueueTokenOut(BaseModel):
    id: str
    token_number: str
    patient_id: str
    patient_name: str
    facility_id: str
    department_id: str
    department_name: str
    sequence_number: int
    status: str
    priority: str
    priority_reason: Optional[str] = None
    registered_at: datetime
    called_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    # computed
    queue_position: Optional[int] = None
    tokens_ahead: Optional[int] = None
    estimated_wait_minutes: Optional[int] = None

    class Config:
        from_attributes = True


class QueueStatusOut(BaseModel):
    """Public queue view – NO patient names."""
    department_id: str
    department_name: str
    facility_name: str
    currently_serving: Optional[str] = None   # token_number only
    next_tokens: List[str] = []               # list of token_numbers only
    total_waiting: int
    total_completed: int


# ──────── Staff actions ────────
class CallNextRequest(BaseModel):
    department_id: str
    staff_id: str


class MarkCompleteRequest(BaseModel):
    token_id: str
    staff_id: str
    notes: Optional[str] = None


class EmergencyPriorityRequest(BaseModel):
    token_id: str
    staff_id: str
    reason: str = Field(..., min_length=10, max_length=500)  # Mandatory reason


class CancelTokenRequest(BaseModel):
    token_id: str
    staff_id: str
    reason: Optional[str] = None


# ──────── Audit ────────
class AuditLogOut(BaseModel):
    id: str
    staff_id: Optional[str] = None
    action: str
    entity_type: str
    entity_id: str
    before_state: Optional[str] = None
    after_state: Optional[str] = None
    reason: Optional[str] = None
    flagged: bool
    logged_at: datetime

    class Config:
        from_attributes = True


# ──────── Stats ────────
class QueueStatsOut(BaseModel):
    total_registered: int
    total_waiting: int
    total_in_consultation: int
    total_completed: int
    currently_serving_token: Optional[str] = None
    avg_wait_minutes: Optional[float] = None
