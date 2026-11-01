import React, { useEffect, useState } from 'react';
import { useFairQueue } from '../../context/FairQueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuditLogEntry } from '../../types';
import { ArrowLeft, Shield, AlertTriangle, Clock, ChevronDown, ChevronUp, Eye, Flag } from 'lucide-react';

interface Props { onBack: () => void; }

const ACTION_LABELS: Record<string, string> = {
  PATIENT_REGISTERED:  'Patient Registered',
  TOKEN_CALLED:        'Token Called',
  TOKEN_COMPLETED:     'Consultation Completed',
  EMERGENCY_PRIORITY:  'Emergency Priority Set',
  PRIORITY_OVERRIDE:   'Priority Override',
};

const ACTION_COLOR: Record<string, string> = {
  PATIENT_REGISTERED: 'bg-teal-100 text-teal-800',
  TOKEN_CALLED:       'bg-blue-100 text-blue-800',
  TOKEN_COMPLETED:    'bg-green-100 text-green-800',
  EMERGENCY_PRIORITY: 'bg-red-100 text-red-800',
  PRIORITY_OVERRIDE:  'bg-orange-100 text-orange-800',
};

export const AuditLogPanel: React.FC<Props> = ({ onBack }) => {
  const { loadAuditLog, auditLog, isStaffLoggedIn } = useFairQueue();
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isStaffLoggedIn) return;
    setLoading(true);
    loadAuditLog().finally(() => setLoading(false));
  }, [isStaffLoggedIn]);

  const flaggedCount = auditLog.filter(e => e.flagged).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">{t('fqAuditTitle')}</h2>
            <p className="text-slate-400 text-sm">{t('fqAuditSubtitle')}</p>
          </div>
        </div>
        <p className="text-slate-400 text-xs mt-2">
          All queue modifications are recorded permanently. Records cannot be deleted or modified. This log is available to administrators for review.
        </p>
        {flaggedCount > 0 && (
          <div className="mt-3 bg-red-900/40 border border-red-700 rounded-xl p-3 flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-400" />
            <p className="text-red-300 text-sm font-bold">{flaggedCount} {t('fqFlaggedFor')}</p>
          </div>
        )}
      </div>

      {!isStaffLoggedIn ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700">{t('fqStaffLoginRequired')}</p>
          <p className="text-sm text-slate-500 mt-1">Please login from the Staff Dashboard</p>
        </div>
      ) : loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-500 font-semibold">Loading audit records...</p>
        </div>
      ) : auditLog.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-500 font-semibold">No audit records yet</p>
          <p className="text-xs text-slate-400 mt-1">Records will appear as queue actions are performed</p>
        </div>
      ) : (
        <div className="space-y-2">
          {auditLog.map(entry => (
            <div key={entry.id} className={`bg-white border rounded-2xl overflow-hidden transition-shadow hover:shadow-sm ${entry.flagged ? 'border-red-200' : 'border-slate-200'}`}>
              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                {/* Action badge */}
                <span className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase flex-shrink-0 ${ACTION_COLOR[entry.action] || 'bg-slate-100 text-slate-700'}`}>
                  {ACTION_LABELS[entry.action] || entry.action}
                </span>

                {/* Entity */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{entry.entity_type} · {entry.entity_id.slice(0, 8)}...</p>
                  {entry.reason && <p className="text-xs text-slate-500 truncate">{entry.reason}</p>}
                </div>

                {/* Flagged */}
                {entry.flagged && (
                  <span className="flex items-center gap-1 text-red-600 text-[10px] font-extrabold flex-shrink-0">
                    <Flag className="w-3 h-3" /> FLAGGED
                  </span>
                )}

                {/* Timestamp */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-bold text-slate-500">{new Date(entry.logged_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-[9px] text-slate-400">{new Date(entry.logged_at).toLocaleDateString('en-IN')}</p>
                </div>

                {expanded === entry.id ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>

              {/* Expanded details */}
              {expanded === entry.id && (
                <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-500 uppercase">Staff ID</p>
                      <p className="font-mono text-slate-800 mt-0.5">{entry.staff_id || 'SYSTEM'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-500 uppercase">Timestamp</p>
                      <p className="font-mono text-slate-800 mt-0.5">{new Date(entry.logged_at).toLocaleString('en-IN')}</p>
                    </div>
                    {entry.reason && (
                      <div className="col-span-2">
                        <p className="font-bold text-slate-500 uppercase">Reason</p>
                        <p className="text-slate-800 mt-0.5">{entry.reason}</p>
                      </div>
                    )}
                    {entry.before_state && (
                      <div>
                        <p className="font-bold text-slate-500 uppercase">Before</p>
                        <pre className="text-slate-700 text-[10px] bg-white border border-slate-200 rounded-lg p-2 mt-0.5 overflow-x-auto">{JSON.stringify(JSON.parse(entry.before_state), null, 2)}</pre>
                      </div>
                    )}
                    {entry.after_state && (
                      <div>
                        <p className="font-bold text-slate-500 uppercase">After</p>
                        <pre className="text-slate-700 text-[10px] bg-white border border-slate-200 rounded-lg p-2 mt-0.5 overflow-x-auto">{JSON.stringify(JSON.parse(entry.after_state), null, 2)}</pre>
                      </div>
                    )}
                  </div>

                  {entry.flagged && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Queue Integrity Monitor flagged this entry
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Unusual manual intervention pattern detected. Please review for clinical appropriateness. No automatic action taken.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
