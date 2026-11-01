"""
WebSocket connection manager.
Manages rooms per department so only relevant clients get updates.
"""
from __future__ import annotations
import json
from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    """
    Manages WebSocket connections grouped by department_id.
    When a queue event occurs, broadcast to everyone watching that department.
    """

    def __init__(self):
        # department_id -> list of WebSocket connections
        self._rooms: Dict[str, List[WebSocket]] = {}
        # also a global room for staff dashboards watching all departments
        self._global: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, room: str = "global"):
        await websocket.accept()
        if room == "global":
            self._global.append(websocket)
        else:
            self._rooms.setdefault(room, []).append(websocket)

    def disconnect(self, websocket: WebSocket, room: str = "global"):
        if room == "global":
            self._rooms.get("global", [])
            if websocket in self._global:
                self._global.remove(websocket)
        else:
            room_list = self._rooms.get(room, [])
            if websocket in room_list:
                room_list.remove(websocket)

    async def broadcast_to_room(self, room: str, data: dict):
        """Send a message to all connections in a specific department room AND global."""
        message = json.dumps(data)
        dead = []
        for ws in self._rooms.get(room, []):
            try:
                await ws.send_text(message)
            except Exception:
                dead.append((ws, room))

        for ws in self._global:
            try:
                await ws.send_text(message)
            except Exception:
                dead.append((ws, "global"))

        # Clean up dead connections
        for ws, r in dead:
            self.disconnect(ws, r)

    async def broadcast_global(self, data: dict):
        """Send to all global watchers."""
        message = json.dumps(data)
        dead = []
        for ws in self._global:
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws, "global")


manager = ConnectionManager()
