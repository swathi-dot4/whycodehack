"""
CareBridge AI – Smart FairQueue API
FastAPI main application entry point.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db, AsyncSessionLocal
from .seed import seed_database
from .routers import auth, facilities, queue, websocket


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo data
    await init_db()
    async with AsyncSessionLocal() as db:
        await seed_database(db)
    print("[OK] CareBridge AI - Smart FairQueue API is running!")
    yield
    # Shutdown cleanup (if any)


app = FastAPI(
    title="CareBridge AI – Smart FairQueue API",
    description=(
        "Transparent Digital Token Management System for rural healthcare. "
        "Supports patient registration, live queue tracking, staff actions, "
        "emergency priority with mandatory audit trail, and real-time WebSocket updates."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow the Vite dev server (port 5173) and any local origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
        "*",  # Restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router,        prefix="/api/v1")
app.include_router(facilities.router,  prefix="/api/v1")
app.include_router(queue.router,       prefix="/api/v1")
app.include_router(websocket.router)   # WebSocket has no /api/v1 prefix


@app.get("/")
async def root():
    return {
        "service": "CareBridge AI – Smart FairQueue",
        "status": "running",
        "docs": "/docs",
        "message": (
            "Every patient deserves fair access to healthcare. "
            "Your queue position is transparent and traceable."
        ),
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
