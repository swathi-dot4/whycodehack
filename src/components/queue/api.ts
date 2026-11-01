/**
 * Smart FairQueue – API Client
 * Thin fetch wrapper connecting to the FastAPI backend at :8000
 */

const BASE = 'http://localhost:8000/api/v1';

let _authToken: string | null = localStorage.getItem('fq_auth_token');
let _staffId: string | null = localStorage.getItem('fq_staff_id');

export const queueApi = {

  // ─── Auth ──────────────────────────────────────────────────────────────────
  setToken(token: string, staffId: string) {
    _authToken = token;
    _staffId = staffId;
    localStorage.setItem('fq_auth_token', token);
    localStorage.setItem('fq_staff_id', staffId);
  },

  clearToken() {
    _authToken = null;
    _staffId = null;
    localStorage.removeItem('fq_auth_token');
    localStorage.removeItem('fq_staff_id');
  },

  getStaffId() { return _staffId; },
  isStaffLoggedIn() { return !!_authToken; },

  async login(username: string, password: string) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed – check credentials');
    return res.json();
  },

  // ─── Facilities & Departments ───────────────────────────────────────────────
  async getFacilities() {
    const res = await fetch(`${BASE}/facilities`);
    if (!res.ok) throw new Error('Failed to load facilities');
    return res.json();
  },

  async getDepartments(facilityId: string) {
    const res = await fetch(`${BASE}/facilities/${facilityId}/departments`);
    if (!res.ok) throw new Error('Failed to load departments');
    return res.json();
  },

  // ─── Queue Registration ─────────────────────────────────────────────────────
  async registerPatient(data: object) {
    const res = await fetch(`${BASE}/queue/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  // ─── Token Lookup ───────────────────────────────────────────────────────────
  async getToken(tokenId: string) {
    const res = await fetch(`${BASE}/queue/token/${tokenId}`);
    if (!res.ok) throw new Error('Token not found');
    return res.json();
  },

  // ─── Public Queue Status (no patient names) ─────────────────────────────────
  async getQueueStatus(deptId: string) {
    const res = await fetch(`${BASE}/queue/status/${deptId}`);
    if (!res.ok) throw new Error('Failed to get queue status');
    return res.json();
  },

  // ─── Staff: Queue List ──────────────────────────────────────────────────────
  async getQueueList(deptId: string, statusFilter?: string) {
    const url = `${BASE}/queue/list/${deptId}${statusFilter ? `?status_filter=${statusFilter}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${_authToken}` },
    });
    if (!res.ok) throw new Error('Unauthorized or failed to load queue');
    return res.json();
  },

  async getStats(deptId: string) {
    const res = await fetch(`${BASE}/queue/stats/${deptId}`, {
      headers: { Authorization: `Bearer ${_authToken}` },
    });
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  // ─── Staff Actions ──────────────────────────────────────────────────────────
  async callNext(deptId: string) {
    const res = await fetch(`${BASE}/queue/call-next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_authToken}` },
      body: JSON.stringify({ department_id: deptId, staff_id: _staffId }),
    });
    if (!res.ok) throw new Error('Failed to call next');
    return res.json();
  },

  async markInConsultation(tokenId: string) {
    const res = await fetch(`${BASE}/queue/mark-in-consultation?token_id=${tokenId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${_authToken}` },
    });
    if (!res.ok) throw new Error('Failed to mark in consultation');
    return res.json();
  },

  async markComplete(tokenId: string, notes?: string) {
    const res = await fetch(`${BASE}/queue/mark-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_authToken}` },
      body: JSON.stringify({ token_id: tokenId, staff_id: _staffId, notes }),
    });
    if (!res.ok) throw new Error('Failed to mark complete');
    return res.json();
  },

  async setEmergencyPriority(tokenId: string, reason: string) {
    const res = await fetch(`${BASE}/queue/emergency-priority`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_authToken}` },
      body: JSON.stringify({ token_id: tokenId, staff_id: _staffId, reason }),
    });
    if (!res.ok) throw new Error('Failed to set priority');
    return res.json();
  },

  // ─── Audit Log ──────────────────────────────────────────────────────────────
  async getAuditLog(limit = 100) {
    const res = await fetch(`${BASE}/queue/audit?limit=${limit}`, {
      headers: { Authorization: `Bearer ${_authToken}` },
    });
    if (!res.ok) throw new Error('Unauthorized to view audit log');
    return res.json();
  },

  // ─── WebSocket ──────────────────────────────────────────────────────────────
  createWebSocket(deptId: string): WebSocket {
    const wsUrl = `ws://localhost:8000/ws/${deptId}`;
    const ws = new WebSocket(wsUrl);
    // Keep-alive ping every 30s
    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send('ping');
    }, 30000);
    ws.addEventListener('close', () => clearInterval(ping));
    return ws;
  },
};
