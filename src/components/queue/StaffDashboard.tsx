import React, { useState, useEffect } from 'react';
import { useFairQueue } from '../../context/FairQueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { QueueToken } from '../../types';
import {
  ArrowLeft, LogIn, LogOut, ChevronRight, Users, Stethoscope,
  CheckCircle, AlertTriangle, Search, Filter, RefreshCw,
  ShieldAlert, Clock, Building2, UserCheck
} from 'lucide-react';

interface Props { onBack: () => void; }

const STATUS_BADGE: Record<string, string> = {
  WAITING:         'bg-amber-100 text-amber-800 border-amber-300',
  CALLED:          'bg-blue-100 text-blue-800 border-blue-300',
  IN_CONSULTATION: 'bg-green-100 text-green-800 border-green-300',
  COMPLETED:       'bg-slate-100 text-slate-600 border-slate-300',
  CANCELLED:       'bg-red-100 text-red-700 border-red-300',
};
const PRIORITY_BADGE: Record<string, string> = {
  NORMAL:    'bg-slate-100 text-slate-600',
  EMERGENCY: 'bg-red-100 text-red-700 font-extrabold',
};

export const StaffDashboard: React.FC<Props> = ({ onBack }) => {
  const {
    isStaffLoggedIn, staffLogin, staffLogout, staffName, staffRole,
    queueList, stats, selectedDepartment, facilities, departments,
    setSelectedFacility, setSelectedDepartment, loadDepartments,
    refreshStaffView, callNext, markInConsultation, markComplete, setEmergencyPriority,
    serverOnline,
  } = useFairQueue();
  const { t } = useLanguage();

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [emergencyModal, setEmergencyModal] = useState<{ token: QueueToken } | null>(null);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Facility/dept selection for staff
  const [facId, setFacId] = useState('');
  const [deptId, setDeptId] = useState('');

  useEffect(() => {
    if (isStaffLoggedIn && selectedDepartment) {
      refreshStaffView();
      const id = setInterval(refreshStaffView, 15000);
      return () => clearInterval(id);
    }
  }, [isStaffLoggedIn, selectedDepartment?.id]);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      await staffLogin(loginUser, loginPass);
      showFeedback('success', 'Logged in successfully');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    setActionLoading('call');
    try {
      const res = await callNext();
      showFeedback('success', 'Next patient called!');
    } catch (e: any) {
      showFeedback('error', e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkComplete = async (tokenId: string) => {
    setActionLoading(tokenId);
    try {
      await markComplete(tokenId);
      showFeedback('success', 'Consultation marked complete');
    } catch (e: any) {
      showFeedback('error', e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkInConsultation = async (tokenId: string) => {
    setActionLoading(tokenId + '_consult');
    try {
      await markInConsultation(tokenId);
      showFeedback('success', 'Marked as in consultation');
    } catch (e: any) {
      showFeedback('error', e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEmergency = async () => {
    if (!emergencyModal || emergencyReason.trim().length < 10) return;
    setActionLoading('emergency');
    try {
      const res = await setEmergencyPriority(emergencyModal.token.id, emergencyReason);
      setEmergencyModal(null);
      setEmergencyReason('');
      showFeedback('success', 'Emergency priority set — action recorded in audit log');
    } catch (e: any) {
      showFeedback('error', e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredList = queueList.filter(t => {
    const matchSearch = !search || t.token_number.toLowerCase().includes(search.toLowerCase()) || t.patient_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─── Login screen ────────────────────────────────────────────────────────
  if (!isStaffLoggedIn) return (
    <div className="max-w-md mx-auto space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="w-7 h-7 text-violet-700" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Staff Login</h2>
          <p className="text-sm text-slate-500 mt-1">Authorized staff only</p>
        </div>

        {!serverOnline && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-semibold text-center">
            Server offline — staff actions unavailable
          </div>
        )}

        {loginError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="Username" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none font-semibold" />
          <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none font-semibold" />
          <button type="submit" disabled={loading || !serverOnline} className="w-full py-4 bg-violet-600 text-white font-black text-lg rounded-2xl hover:bg-violet-700 transition-colors disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-5 bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
          <p className="font-bold mb-1">Demo credentials:</p>
          <p>doctor1 / doctor1234 &nbsp;|&nbsp; reception1 / reception1234</p>
          <p>asha1 / asha1234 &nbsp;|&nbsp; admin / admin1234</p>
        </div>
      </div>
    </div>
  );

  // ─── Dept selection after login ──────────────────────────────────────────
  if (!selectedDepartment) return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Select Your Department</h2>
            <p className="text-sm text-slate-500">Welcome, {staffName} ({staffRole})</p>
          </div>
          <button onClick={staffLogout} className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        {/* Facility */}
        <label className="block text-sm font-bold text-slate-700 mb-2">Hospital / Facility</label>
        <select
          value={facId}
          onChange={async e => { setFacId(e.target.value); await loadDepartments(e.target.value); setDeptId(''); }}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none font-semibold mb-4 bg-white"
        >
          <option value="">Select facility...</option>
          {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>

        {/* Departments */}
        {facId && departments.length > 0 && (
          <>
            <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
            <div className="grid grid-cols-2 gap-2">
              {departments.map(d => (
                <button key={d.id} onClick={() => {
                  setDeptId(d.id);
                  setSelectedDepartment(d);
                  setSelectedFacility(facilities.find(f => f.id === facId) || null);
                }}
                className="flex flex-col items-center p-4 bg-slate-50 hover:bg-violet-50 border-2 border-slate-200 hover:border-violet-400 rounded-xl transition-all">
                  <span className="text-2xl font-black text-violet-700">{d.code}</span>
                  <span className="text-xs font-bold text-slate-600 text-center mt-1">{d.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ─── Main staff dashboard ────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button onClick={refreshStaffView} className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={staffLogout} className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className={`rounded-xl p-3 text-sm font-bold flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {feedback.msg}
        </div>
      )}

      {/* Identity bar */}
      <div className="bg-gradient-to-r from-violet-700 to-violet-600 rounded-2xl px-5 py-4 flex items-center justify-between text-white">
        <div>
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Staff Dashboard</p>
          <p className="font-extrabold text-lg">{staffName}</p>
          <p className="text-xs opacity-70">{staffRole} • {selectedDepartment.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70">Now Serving</p>
          <p className="text-3xl font-black">{stats?.currently_serving_token || '—'}</p>
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total_registered, color: 'text-slate-700', bg: 'bg-slate-50' },
            { label: 'Waiting', value: stats.total_waiting, color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'In Room', value: stats.total_in_consultation, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Done', value: stats.total_completed, color: 'text-green-700', bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Primary action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleCallNext}
          disabled={actionLoading === 'call'}
          className="flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-lg rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
        >
          <ChevronRight className="w-6 h-6" />
          {actionLoading === 'call' ? 'Calling...' : 'Call Next Patient'}
        </button>
        <div className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-600 font-bold">
          <Users className="w-5 h-5 text-teal-600" />
          <span>{stats?.total_waiting || 0} patients waiting</span>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by token or name..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-sm font-semibold"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-sm font-semibold bg-white"
        >
          <option value="">All Status</option>
          <option value="WAITING">Waiting</option>
          <option value="CALLED">Called</option>
          <option value="IN_CONSULTATION">In Consultation</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Patient queue table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <p className="font-extrabold text-slate-800">Queue List — {selectedDepartment.name}</p>
          <span className="text-xs text-slate-500">{filteredList.length} patients</span>
        </div>

        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-semibold">No patients in queue</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map(token => (
              <div key={token.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                {/* Token number */}
                <div className="w-16 text-center">
                  <span className={`text-lg font-black ${token.priority === 'EMERGENCY' ? 'text-red-700' : 'text-teal-800'}`}>{token.token_number}</span>
                  {token.priority === 'EMERGENCY' && (
                    <p className="text-[9px] font-extrabold text-red-600 uppercase">EMERGENCY</p>
                  )}
                </div>

                {/* Patient info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{token.patient_name}</p>
                  <p className="text-xs text-slate-500">Reg: {new Date(token.registered_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {/* Status badge */}
                <span className={`hidden sm:inline-flex px-2 py-1 rounded-lg text-[10px] font-extrabold border ${STATUS_BADGE[token.status] || 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  {token.status.replace(/_/g, ' ')}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {token.status === 'CALLED' && (
                    <button
                      onClick={() => handleMarkInConsultation(token.id)}
                      disabled={actionLoading === token.id + '_consult'}
                      title="Mark In Consultation"
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  )}
                  {(token.status === 'IN_CONSULTATION' || token.status === 'CALLED') && (
                    <button
                      onClick={() => handleMarkComplete(token.id)}
                      disabled={actionLoading === token.id}
                      title="Mark Complete"
                      className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {token.status === 'WAITING' && token.priority !== 'EMERGENCY' && (staffRole === 'DOCTOR' || staffRole === 'ADMIN') && (
                    <button
                      onClick={() => setEmergencyModal({ token })}
                      title="Set Emergency Priority"
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Priority Modal */}
      {emergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Set Emergency Priority</h3>
                <p className="text-xs text-slate-500">Token: {emergencyModal.token.token_number} — {emergencyModal.token.patient_name}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 font-semibold">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              This action will be permanently recorded with your staff ID, timestamp, and reason. You cannot undo this audit record.
            </div>

            <label className="block text-sm font-bold text-slate-700 mb-1">
              Clinical Reason <span className="text-red-500">*</span>
              <span className="text-slate-400 font-normal ml-1">(minimum 10 characters)</span>
            </label>
            <textarea
              value={emergencyReason}
              onChange={e => setEmergencyReason(e.target.value)}
              placeholder="Describe the clinical emergency that justifies priority (e.g., severe chest pain with BP 180/110, requires immediate assessment)"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:outline-none text-sm font-semibold resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">{emergencyReason.length}/500 characters</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setEmergencyModal(null); setEmergencyReason(''); }}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergency}
                disabled={emergencyReason.trim().length < 10 || actionLoading === 'emergency'}
                className="flex-1 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading === 'emergency' ? 'Setting...' : 'Confirm Priority'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
