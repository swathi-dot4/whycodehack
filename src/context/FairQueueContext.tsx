import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  QueueFacility, QueueDepartment, QueueToken, QueueStatus,
  QueueStats, AuditLogEntry, PatientRegistrationForm
} from '../types';
import { queueApi } from '../components/queue/api';

// ─── IndexedDB helpers (offline-first) ─────────────────────────────────────

const DB_NAME = 'carebridge_queue_offline';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('pending_tokens')) {
        db.createObjectStore('pending_tokens', { keyPath: 'offline_id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function savePendingToken(data: PatientRegistrationForm & { token_number: string; registered_at: string }) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('pending_tokens', 'readwrite');
    tx.objectStore('pending_tokens').put(data);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getPendingTokens(): Promise<any[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending_tokens', 'readonly');
    const req = tx.objectStore('pending_tokens').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deletePendingToken(offlineId: string) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('pending_tokens', 'readwrite');
    tx.objectStore('pending_tokens').delete(offlineId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ─── Context type ───────────────────────────────────────────────────────────

interface FairQueueContextType {
  // Connection
  isOnline: boolean;
  serverOnline: boolean;
  isStaffLoggedIn: boolean;
  staffLogin: (username: string, password: string) => Promise<{ role: string; full_name: string }>;
  staffLogout: () => void;
  staffName: string;
  staffRole: string;

  // Facilities / Departments
  facilities: QueueFacility[];
  departments: QueueDepartment[];
  selectedFacility: QueueFacility | null;
  selectedDepartment: QueueDepartment | null;
  setSelectedFacility: (f: QueueFacility | null) => void;
  loadDepartments: (facilityId: string) => Promise<void>;
  setSelectedDepartment: (d: QueueDepartment | null) => void;

  // Registration
  registerPatient: (form: PatientRegistrationForm) => Promise<QueueToken>;
  myToken: QueueToken | null;
  setMyToken: (t: QueueToken | null) => void;

  // Live queue (patient view)
  queueStatus: QueueStatus | null;
  refreshStatus: () => Promise<void>;

  // Staff
  queueList: QueueToken[];
  stats: QueueStats | null;
  auditLog: AuditLogEntry[];
  refreshStaffView: () => Promise<void>;
  callNext: () => Promise<void>;
  markInConsultation: (tokenId: string) => Promise<void>;
  markComplete: (tokenId: string, notes?: string) => Promise<void>;
  setEmergencyPriority: (tokenId: string, reason: string) => Promise<void>;
  loadAuditLog: () => Promise<void>;

  // Offline
  pendingOfflineCount: number;
  syncPending: () => Promise<void>;
}

const FairQueueContext = createContext<FairQueueContextType | undefined>(undefined);

export const FairQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverOnline, setServerOnline] = useState(false);
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(queueApi.isStaffLoggedIn());
  const [staffName, setStaffName] = useState(localStorage.getItem('fq_staff_name') || '');
  const [staffRole, setStaffRole] = useState(localStorage.getItem('fq_staff_role') || '');

  const [facilities, setFacilities] = useState<QueueFacility[]>([]);
  const [departments, setDepartments] = useState<QueueDepartment[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<QueueFacility | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<QueueDepartment | null>(null);

  const [myToken, setMyToken] = useState<QueueToken | null>(() => {
    try { return JSON.parse(localStorage.getItem('fq_my_token') || 'null'); }
    catch { return null; }
  });

  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [queueList, setQueueList] = useState<QueueToken[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [pendingOfflineCount, setPendingOfflineCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<number | null>(null);

  // ─── Network listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const onOnline = () => { setIsOnline(true); syncPending(); };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  // ─── Server health check ──────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('http://localhost:8000/health', { signal: AbortSignal.timeout(3000) });
        setServerOnline(res.ok);
        if (res.ok && facilities.length === 0) loadFacilities();
      } catch {
        setServerOnline(false);
      }
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  // ─── Persist myToken ─────────────────────────────────────────────────────
  useEffect(() => {
    if (myToken) localStorage.setItem('fq_my_token', JSON.stringify(myToken));
    else localStorage.removeItem('fq_my_token');
  }, [myToken]);

  // ─── Pending offline count ────────────────────────────────────────────────
  useEffect(() => {
    getPendingTokens().then(t => setPendingOfflineCount(t.length)).catch(() => {});
  }, []);

  // ─── WebSocket connection for live updates ────────────────────────────────
  useEffect(() => {
    if (!selectedDepartment || !serverOnline) return;
    const ws = queueApi.createWebSocket(selectedDepartment.id);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'pong') return;
        // Auto-refresh on any queue event
        refreshStatus();
        if (isStaffLoggedIn) refreshStaffView();
        // Announce if MY token was called
        if (myToken && data.token_number === myToken.token_number && data.event === 'TOKEN_CALLED') {
          announceToken(myToken.token_number);
        }
      } catch { /* ignore */ }
    };

    ws.onerror = () => ws.close();

    return () => { ws.close(); wsRef.current = null; };
  }, [selectedDepartment?.id, serverOnline]);

  // ─── Polling fallback (every 15s) ────────────────────────────────────────
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = window.setInterval(() => {
      if (selectedDepartment && serverOnline) {
        refreshStatus();
        if (isStaffLoggedIn) refreshStaffView();
      }
    }, 15000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedDepartment?.id, serverOnline, isStaffLoggedIn]);

  // ─── TTS announcement ────────────────────────────────────────────────────
  const announceToken = (tokenNumber: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(`Token number ${tokenNumber} please proceed to the doctor`);
    utterance.lang = 'en-IN';
    utterance.rate = 0.85;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  // ─── API actions ──────────────────────────────────────────────────────────
  const loadFacilities = async () => {
    try {
      const data = await queueApi.getFacilities();
      setFacilities(data);
    } catch { /* server offline */ }
  };

  const loadDepartments = async (facilityId: string) => {
    try {
      const data = await queueApi.getDepartments(facilityId);
      setDepartments(data);
    } catch { setDepartments([]); }
  };

  const staffLogin = async (username: string, password: string) => {
    const data = await queueApi.login(username, password);
    queueApi.setToken(data.access_token, data.user_id);
    setIsStaffLoggedIn(true);
    setStaffName(data.full_name);
    setStaffRole(data.role);
    localStorage.setItem('fq_staff_name', data.full_name);
    localStorage.setItem('fq_staff_role', data.role);
    return { role: data.role, full_name: data.full_name };
  };

  const staffLogout = () => {
    queueApi.clearToken();
    setIsStaffLoggedIn(false);
    setStaffName('');
    setStaffRole('');
    localStorage.removeItem('fq_staff_name');
    localStorage.removeItem('fq_staff_role');
  };

  const registerPatient = async (form: PatientRegistrationForm): Promise<QueueToken> => {
    const offlineId = form.offline_id || `offline-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (!serverOnline || !isOnline) {
      // Offline: generate local token
      const dept = departments.find(d => d.id === form.department_id);
      const seq = Date.now() % 1000;
      const localToken: QueueToken = {
        id: offlineId,
        token_number: `${dept?.code || 'X'}-${String(seq).padStart(3, '0')} [OFFLINE]`,
        patient_id: offlineId,
        patient_name: form.name,
        facility_id: form.facility_id,
        department_id: form.department_id,
        department_name: dept?.name || 'Unknown',
        sequence_number: seq,
        status: 'WAITING',
        priority: 'NORMAL',
        registered_at: new Date().toISOString(),
        queue_position: undefined,
        tokens_ahead: undefined,
      };
      await savePendingToken({ ...form, offline_id: offlineId, token_number: localToken.token_number, registered_at: localToken.registered_at });
      setPendingOfflineCount(c => c + 1);
      setMyToken(localToken);
      return localToken;
    }

    const token = await queueApi.registerPatient({ ...form, offline_id: offlineId });
    setMyToken(token);
    return token;
  };

  const refreshStatus = useCallback(async () => {
    if (!selectedDepartment || !serverOnline) return;
    try {
      const data = await queueApi.getQueueStatus(selectedDepartment.id);
      setQueueStatus(data);
      // Refresh myToken position
      if (myToken && myToken.id && !myToken.id.startsWith('offline')) {
        const updated = await queueApi.getToken(myToken.id).catch(() => null);
        if (updated) setMyToken(updated);
      }
    } catch { /* ignore */ }
  }, [selectedDepartment?.id, serverOnline, myToken?.id]);

  const refreshStaffView = useCallback(async () => {
    if (!selectedDepartment || !serverOnline || !isStaffLoggedIn) return;
    try {
      const [list, st] = await Promise.all([
        queueApi.getQueueList(selectedDepartment.id),
        queueApi.getStats(selectedDepartment.id),
      ]);
      setQueueList(list);
      setStats(st);
    } catch { /* ignore */ }
  }, [selectedDepartment?.id, serverOnline, isStaffLoggedIn]);

  const callNext = async () => {
    if (!selectedDepartment) return;
    const res = await queueApi.callNext(selectedDepartment.id);
    await refreshStaffView();
    if (res.token?.token_number) announceToken(res.token.token_number);
  };

  const markInConsultation = async (tokenId: string) => {
    await queueApi.markInConsultation(tokenId);
    await refreshStaffView();
  };

  const markComplete = async (tokenId: string, notes?: string) => {
    await queueApi.markComplete(tokenId, notes);
    await refreshStaffView();
  };

  const setEmergencyPriority = async (tokenId: string, reason: string) => {
    await queueApi.setEmergencyPriority(tokenId, reason);
    await refreshStaffView();
  };

  const loadAuditLog = async () => {
    const data = await queueApi.getAuditLog(100);
    setAuditLog(data);
  };

  const syncPending = async () => {
    const pending = await getPendingTokens();
    if (pending.length === 0) return;
    let synced = 0;
    for (const item of pending) {
      try {
        await queueApi.registerPatient(item);
        await deletePendingToken(item.offline_id);
        synced++;
      } catch { /* skip failed */ }
    }
    setPendingOfflineCount(pending.length - synced);
  };

  return (
    <FairQueueContext.Provider value={{
      isOnline, serverOnline,
      isStaffLoggedIn, staffLogin, staffLogout, staffName, staffRole,
      facilities, departments,
      selectedFacility, setSelectedFacility,
      selectedDepartment, setSelectedDepartment,
      loadDepartments,
      registerPatient, myToken, setMyToken,
      queueStatus, refreshStatus,
      queueList, stats, auditLog,
      refreshStaffView, callNext, markInConsultation, markComplete,
      setEmergencyPriority, loadAuditLog,
      pendingOfflineCount, syncPending,
    }}>
      {children}
    </FairQueueContext.Provider>
  );
};

export const useFairQueue = () => {
  const ctx = useContext(FairQueueContext);
  if (!ctx) throw new Error('useFairQueue must be used within FairQueueProvider');
  return ctx;
};
