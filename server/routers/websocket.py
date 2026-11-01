"""
WebSocket router – real-time queue updates.
Clients connect to /ws/{department_id} to receive live events.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..websocket_manager import manager

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/{department_id}")
async def websocket_queue(websocket: WebSocket, department_id: str):
    """
    Connect to real-time queue updates for a specific department.
    Use department_id = "global" to receive all updates (staff dashboard).
    No patient names are broadcast – only token numbers and status.
    """
    await manager.connect(websocket, department_id)
    try:
        while True:
            # Keep connection alive; server pushes events to client
            data = await websocket.receive_text()
            # Clients can send "ping" to keep alive
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, department_id)
