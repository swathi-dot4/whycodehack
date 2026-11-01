import React, { useEffect, useState } from 'react';
import { useFairQueue } from '../../context/FairQueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Clock, Users, Ticket, CheckCircle, Volume2, RefreshCw, AlertCircle } from 'lucide-react';

interface Props { onBack: () => void; }

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  WAITING:          { label: 'Waiting',          color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200',  dot: 'bg-amber-500' },
  CALLED:           { label: 'Called! Please go', color: 'text-blue-700',  bg: 'bg-blue-50   border-blue-300',   dot: 'bg-blue-500 animate-pulse' },
  IN_CONSULTATION:  { label: 'In Consultation',  color: 'text-green-700', bg: 'bg-green-50  border-green-300',  dot: 'bg-green-500' },
  COMPLETED:        { label: 'Completed',         color: 'text-slate-600', bg: 'bg-slate-50  border-slate-200',  dot: 'bg-slate-400' },
  CANCELLED:        { label: 'Cancelled',         color: 'text-red-700',   bg: 'bg-red-50    border-red-200',    dot: 'bg-red-500' },
};

export const QueueTrackingPage: React.FC<Props> = ({ onBack }) => {
  const { myToken, queueStatus, refreshStatus, serverOnline, setMyToken, selectedDepartment, facilities, departments } = useFairQueue();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshStatus();
    const id = setInterval(refreshStatus, 10000);
    return () => clearInterval(id);
  }, []);

  const doRefresh = async () => {
    setRefreshing(true);
    await refreshStatus();
    setRefreshing(false);
  };

  const announceMyToken = () => {
    if (!myToken || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(`Your token is ${myToken.token_number}. Current status: ${myToken.status?.replace(/_/g, ' ')}.`);
    u.lang = 'en-IN'; u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const statusCfg = myToken ? STATUS_CONFIG[myToken.status] || STATUS_CONFIG.WAITING : STATUS_CONFIG.WAITING;

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={doRefresh} className={`flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors ${refreshing ? 'opacity-50' : ''}`}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {!myToken ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4">
          <Ticket className="w-14 h-14 text-slate-300 mx-auto" />
          <div>
            <p className="text-lg font-black text-slate-700">{t('fqNoToken')}</p>
            <p className="text-sm text-slate-500 mt-1">{t('fqRegisterFirst')}</p>
          </div>
          <button onClick={onBack} className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors">
            {t('fqRegisterNow')}
          </button>
        </div>
      ) : (
        <>
          {/* My Token Card */}
          <div className={`bg-white border-2 rounded-3xl p-6 shadow-sm ${statusCfg.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Token</p>
                <p className="text-5xl sm:text-6xl font-black text-teal-800 tracking-tight mt-1">{myToken.token_number}</p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${statusCfg.bg}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${statusCfg.dot}`} />
                <span className={`text-xs font-extrabold ${statusCfg.color}`}>{statusCfg.label}</span>
              </div>
            </div>

            {/* Called alert */}
            {myToken.status === 'CALLED' && (
              <div className="bg-blue-600 text-white rounded-2xl p-4 mb-4 text-center">
                <p className="text-xl font-black">🔔 It's Your Turn!</p>
                <p className="text-sm opacity-90 mt-1">Please proceed to the doctor's room</p>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {myToken.tokens_ahead !== undefined && myToken.status === 'WAITING' && (
                <div className="bg-white/70 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{t('fqPatientsAhead')}</p>
                  <p className="text-2xl font-black text-amber-700">{myToken.tokens_ahead}</p>
                </div>
              )}
              {myToken.estimated_wait_minutes && myToken.status === 'WAITING' && (
                <div className="bg-white/70 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{t('fqEstWait')}</p>
                  <p className="text-2xl font-black text-blue-700">~{myToken.estimated_wait_minutes}m</p>
                </div>
              )}
              <div className="bg-white/70 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Registered</p>
                <p className="text-sm font-extrabold text-slate-700">{new Date(myToken.registered_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="bg-white/70 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Department</p>
                <p className="text-sm font-extrabold text-slate-700 leading-tight">{myToken.department_name}</p>
              </div>
            </div>
          </div>

          {/* Public queue status */}
          {queueStatus && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" /> Live Queue — {queueStatus.department_name}
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div>
                  <p className="text-3xl font-black text-teal-800">{queueStatus.currently_serving || '—'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{t('fqNowServing')}</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-700">{queueStatus.total_waiting}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{t('fqWaiting')}</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-green-700">{queueStatus.total_completed}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{t('fqCompleted')}</p>
                </div>
              </div>
              {queueStatus.next_tokens.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs font-bold text-slate-500 mb-2">Next Tokens</p>
                  <div className="flex gap-2 flex-wrap">
                    {queueStatus.next_tokens.map(t => (
                      <span key={t} className={`px-3 py-1.5 rounded-full text-sm font-black border-2 ${t === myToken.token_number ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={announceMyToken} className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-teal-200 hover:bg-teal-50 text-teal-700 font-bold rounded-xl transition-colors">
              <Volume2 className="w-4 h-4" /> {t('fqReadAloud')}
            </button>
            <button
              onClick={() => { setMyToken(null); onBack(); }}
              className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-colors"
            >
              Clear Token
            </button>
          </div>

          {/* Fairness note */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-xs text-teal-700 font-semibold text-center">
            Every patient deserves fair access to healthcare. Your queue position is transparent and traceable.
          </div>
        </>
      )}
    </div>
  );
};
