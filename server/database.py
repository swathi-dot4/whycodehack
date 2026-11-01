"""
CareBridge AI – Smart FairQueue
Database configuration using SQLite (swap DATABASE_URL for PostgreSQL when ready).
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# SQLite for zero-setup local dev. Change to:
# postgresql+asyncpg://user:pass@localhost/carebridge  — for production PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./carebridge_queue.db")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    # connect_args needed only for SQLite to allow cross-thread usage
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """FastAPI dependency – yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
