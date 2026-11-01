"""
CareBridge AI – Smart FairQueue
SQLAlchemy ORM models mapping to the required database schema.
Tables: users, patients, healthcare_facilities, departments,
        queue_tokens, queue_events, audit_logs, staff_roles
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, Text,
    ForeignKey, Enum as SAEnum, Float, UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base


def _now():
    return datetime.now(timezone.utc)


def _uuid():
    return str(uuid.uuid4())


# ──────────────────────────────────────────────
# USERS  (staff / admins)
# ──────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id            = Column(String, primary_key=True, default=_uuid)
    username      = Column(String(80),  unique=True, nullable=False)
    full_name     = Column(String(200), nullable=False)
    email         = Column(String(200), unique=True, nullable=True)
    mobile        = Column(String(20),  nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), default=_now)

    roles         = relationship("StaffRole", back_populates="user")
    audit_entries = relationship("AuditLog",  back_populates="staff")


# ──────────────────────────────────────────────
# STAFF ROLES  (per-facility role assignment)
# ──────────────────────────────────────────────
class StaffRole(Base):
    __tablename__ = "staff_roles"

    id          = Column(String, primary_key=True, default=_uuid)
    user_id     = Column(String, ForeignKey("users.id"), nullable=False)
    facility_id = Column(String, ForeignKey("healthcare_facilities.id"), nullable=True)
    role        = Column(SAEnum("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST",
                                "ASHA_WORKER", name="staff_role_enum"), nullable=False)
    granted_at  = Column(DateTime(timezone=True), default=_now)

    user        = relationship("User",               back_populates="roles")
    facility    = relationship("HealthcareFacility", back_populates="staff_roles")


# ──────────────────────────────────────────────
# HEALTHCARE FACILITIES  (hospitals / PHCs)
# ──────────────────────────────────────────────
class HealthcareFacility(Base):
    __tablename__ = "healthcare_facilities"

    id           = Column(String, primary_key=True, default=_uuid)
    name         = Column(String(300), nullable=False)
    facility_type = Column(SAEnum("PHC", "CHC", "Govt Hospital", "District Hospital",
                                  "Specialist Center", name="facility_type_enum"), nullable=False)
    district     = Column(String(100), nullable=False)
    city         = Column(String(100), nullable=False)
    address      = Column(Text,        nullable=True)
    contact_number = Column(String(20),nullable=True)
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime(timezone=True), default=_now)

    departments  = relationship("Department",  back_populates="facility")
    staff_roles  = relationship("StaffRole",   back_populates="facility")
    tokens       = relationship("QueueToken",  back_populates="facility")


# ──────────────────────────────────────────────
# DEPARTMENTS
# ──────────────────────────────────────────────
class Department(Base):
    __tablename__ = "departments"

    id          = Column(String, primary_key=True, default=_uuid)
    facility_id = Column(String, ForeignKey("healthcare_facilities.id"), nullable=False)
    name        = Column(String(200), nullable=False)
    code        = Column(String(10),  nullable=False)   # e.g. "A", "OPD", "EMG"
    is_active   = Column(Boolean, default=True)

    __table_args__ = (UniqueConstraint("facility_id", "code"),)

    facility    = relationship("HealthcareFacility", back_populates="departments")
    tokens      = relationship("QueueToken",         back_populates="department")


# ──────────────────────────────────────────────
# PATIENTS  (minimal info – no diagnosis stored)
# ──────────────────────────────────────────────
class Patient(Base):
    __tablename__ = "patients"

    id               = Column(String, primary_key=True, default=_uuid)
    name             = Column(String(200), nullable=False)
    age              = Column(Integer,     nullable=True)
    gender           = Column(String(20),  nullable=True)   # Optional
    mobile           = Column(String(20),  nullable=True)   # Optional
    preferred_language = Column(String(10), default="en")
    registered_by    = Column(SAEnum("SELF", "ASHA_WORKER", "RECEPTIONIST",
                                     name="reg_method_enum"), nullable=False)
    registered_by_staff_id = Column(String, nullable=True)  # null for self-reg
    created_at       = Column(DateTime(timezone=True), default=_now)

    tokens           = relationship("QueueToken", back_populates="patient")


# ──────────────────────────────────────────────
# QUEUE TOKENS  (the core queue entity)
# ──────────────────────────────────────────────
class QueueToken(Base):
    __tablename__ = "queue_tokens"

    id              = Column(String, primary_key=True, default=_uuid)
    token_number    = Column(String(20),  nullable=False)   # e.g. "A-025"
    patient_id      = Column(String, ForeignKey("patients.id"),             nullable=False)
    facility_id     = Column(String, ForeignKey("healthcare_facilities.id"), nullable=False)
    department_id   = Column(String, ForeignKey("departments.id"),          nullable=False)
    sequence_number = Column(Integer,     nullable=False)
    status          = Column(SAEnum("WAITING", "CALLED", "IN_CONSULTATION",
                                    "COMPLETED", "CANCELLED", name="token_status_enum"),
                             default="WAITING")
    priority        = Column(SAEnum("NORMAL", "EMERGENCY", name="token_priority_enum"),
                             default="NORMAL")
    priority_reason = Column(Text, nullable=True)           # Mandatory if EMERGENCY
    is_offline_generated = Column(Boolean, default=False)  # True = generated without server
    offline_id      = Column(String, nullable=True)        # Client-side UUID for dedup

    registered_at   = Column(DateTime(timezone=True), default=_now)
    called_at       = Column(DateTime(timezone=True), nullable=True)
    completed_at    = Column(DateTime(timezone=True), nullable=True)

    patient         = relationship("Patient",            back_populates="tokens")
    facility        = relationship("HealthcareFacility", back_populates="tokens")
    department      = relationship("Department",         back_populates="tokens")
    events          = relationship("QueueEvent",         back_populates="token")

    __table_args__ = (UniqueConstraint("facility_id", "department_id", "sequence_number"),)


# ──────────────────────────────────────────────
# QUEUE EVENTS  (state transition history)
# ──────────────────────────────────────────────
class QueueEvent(Base):
    __tablename__ = "queue_events"

    id          = Column(String, primary_key=True, default=_uuid)
    token_id    = Column(String, ForeignKey("queue_tokens.id"), nullable=False)
    event_type  = Column(SAEnum("REGISTERED", "CALLED", "IN_CONSULTATION",
                                "COMPLETED", "CANCELLED", "PRIORITY_CHANGED",
                                "RECALLED", name="queue_event_enum"), nullable=False)
    from_status = Column(String(30), nullable=True)
    to_status   = Column(String(30), nullable=True)
    performed_by = Column(String, nullable=True)  # staff user_id or "SYSTEM"
    notes       = Column(Text, nullable=True)
    occurred_at = Column(DateTime(timezone=True), default=_now)

    token       = relationship("QueueToken", back_populates="events")


# ──────────────────────────────────────────────
# AUDIT LOGS  (immutable – no DELETE/UPDATE allowed)
# ──────────────────────────────────────────────
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id          = Column(String, primary_key=True, default=_uuid)
    staff_id    = Column(String, ForeignKey("users.id"), nullable=True)  # null = system
    action      = Column(String(100), nullable=False)     # e.g. "PRIORITY_OVERRIDE"
    entity_type = Column(String(50),  nullable=False)     # "QueueToken" | "Patient"
    entity_id   = Column(String,      nullable=False)
    before_state = Column(Text, nullable=True)             # JSON snapshot
    after_state  = Column(Text, nullable=True)             # JSON snapshot
    reason      = Column(Text, nullable=True)              # Mandatory for sensitive ops
    ip_address  = Column(String(50), nullable=True)
    flagged     = Column(Boolean, default=False)           # Queue Integrity Monitor flag
    logged_at   = Column(DateTime(timezone=True), default=_now)

    staff       = relationship("User", back_populates="audit_entries")
