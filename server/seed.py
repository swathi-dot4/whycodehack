"""
Seed data – creates demo facilities, departments, and a default staff user.
Called once on server startup if tables are empty.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .models import HealthcareFacility, Department, User, StaffRole
from .auth import hash_password


DEMO_FACILITIES = [
    {
        "id": "fac-001",
        "name": "Ananthapur Area Government Hospital",
        "facility_type": "Govt Hospital",
        "district": "Ananthapur",
        "city": "Ananthapur",
        "address": "NH 44, Near Bus Stand, Ananthapur, AP 515001",
        "contact_number": "08554-274100",
    },
    {
        "id": "fac-002",
        "name": "Tadipatri Primary Health Centre",
        "facility_type": "PHC",
        "district": "Ananthapur",
        "city": "Tadipatri",
        "address": "Main Road, Tadipatri, AP 515411",
        "contact_number": "08558-262222",
    },
    {
        "id": "fac-003",
        "name": "Kurnool District Hospital",
        "facility_type": "District Hospital",
        "district": "Kurnool",
        "city": "Kurnool",
        "address": "Hospital Road, Kurnool, AP 518001",
        "contact_number": "08518-228888",
    },
]

DEMO_DEPARTMENTS = [
    # Ananthapur fac-001
    {"id": "dep-001", "facility_id": "fac-001", "name": "General OPD",      "code": "A"},
    {"id": "dep-002", "facility_id": "fac-001", "name": "Paediatrics",       "code": "B"},
    {"id": "dep-003", "facility_id": "fac-001", "name": "Gynaecology",       "code": "C"},
    {"id": "dep-004", "facility_id": "fac-001", "name": "Emergency",         "code": "EMG"},
    {"id": "dep-005", "facility_id": "fac-001", "name": "Orthopaedics",      "code": "D"},
    # Tadipatri PHC fac-002
    {"id": "dep-006", "facility_id": "fac-002", "name": "General OPD",      "code": "A"},
    {"id": "dep-007", "facility_id": "fac-002", "name": "Maternal Health",   "code": "B"},
    # Kurnool fac-003
    {"id": "dep-008", "facility_id": "fac-003", "name": "General OPD",      "code": "A"},
    {"id": "dep-009", "facility_id": "fac-003", "name": "Cardiology",        "code": "C"},
    {"id": "dep-010", "facility_id": "fac-003", "name": "Neurology",         "code": "N"},
]

# Default staff accounts (username / password)
DEMO_STAFF = [
    {
        "id": "usr-staff-001",
        "username": "admin",
        "full_name": "System Administrator",
        "email": "admin@carebridge.local",
        "password": "admin1234",
        "role": "ADMIN",
        "facility_id": None,
    },
    {
        "id": "usr-staff-002",
        "username": "reception1",
        "full_name": "Priya Receptionist",
        "email": "reception@carebridge.local",
        "password": "reception1234",
        "role": "RECEPTIONIST",
        "facility_id": "fac-001",
    },
    {
        "id": "usr-staff-003",
        "username": "doctor1",
        "full_name": "Dr. Venkat Rao",
        "email": "drvenkat@carebridge.local",
        "password": "doctor1234",
        "role": "DOCTOR",
        "facility_id": "fac-001",
    },
    {
        "id": "usr-staff-004",
        "username": "asha1",
        "full_name": "ASHA Worker Lakshmi",
        "email": "lakshmi.asha@carebridge.local",
        "password": "asha1234",
        "role": "ASHA_WORKER",
        "facility_id": "fac-002",
    },
]


async def seed_database(db: AsyncSession):
    """Insert demo data only if tables are empty."""
    # Check if already seeded
    result = await db.execute(select(HealthcareFacility).limit(1))
    if result.scalars().first():
        return  # Already seeded

    # Insert facilities
    for f in DEMO_FACILITIES:
        db.add(HealthcareFacility(**f))

    # Insert departments
    for d in DEMO_DEPARTMENTS:
        db.add(Department(**d))

    # Insert staff users
    for s in DEMO_STAFF:
        user = User(
            id=s["id"],
            username=s["username"],
            full_name=s["full_name"],
            email=s["email"],
            hashed_password=hash_password(s["password"]),
        )
        db.add(user)
        role = StaffRole(
            id=f"role-{s['id']}",
            user_id=s["id"],
            facility_id=s.get("facility_id"),
            role=s["role"],
        )
        db.add(role)

    await db.commit()
    print("[OK] Demo data seeded successfully.")
