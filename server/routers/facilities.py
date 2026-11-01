"""
Facilities router – list hospitals and their departments.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import HealthcareFacility, Department
from ..schemas import FacilityOut, DepartmentOut

router = APIRouter(prefix="/facilities", tags=["Facilities"])


@router.get("", response_model=List[FacilityOut])
async def list_facilities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HealthcareFacility).where(HealthcareFacility.is_active == True))
    return result.scalars().all()


@router.get("/{facility_id}/departments", response_model=List[DepartmentOut])
async def list_departments(facility_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Department).where(
            Department.facility_id == facility_id,
            Department.is_active == True
        )
    )
    return result.scalars().all()
