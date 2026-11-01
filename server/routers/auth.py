"""
Auth router – login and get JWT token.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..database import get_db
from ..models import User, StaffRole
from ..auth import verify_password, create_access_token
from ..schemas import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == req.username))
    user = result.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    # Get primary role
    role_result = await db.execute(
        select(StaffRole).where(StaffRole.user_id == user.id)
    )
    staff_role = role_result.scalars().first()
    role_name = staff_role.role if staff_role else "RECEPTIONIST"

    token = create_access_token({
        "sub": user.id,
        "username": user.username,
        "role": role_name,
    })

    return TokenResponse(
        access_token=token,
        role=role_name,
        user_id=user.id,
        full_name=user.full_name,
    )
