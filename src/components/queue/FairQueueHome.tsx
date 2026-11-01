import React, { useState, useEffect } from 'react';
import { PageView } from '../../types';
import { useFairQueue } from '../../context/FairQueueContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Ticket, Users, ClipboardList, Monitor, ShieldCheck,
  Wifi, WifiOff, Server, AlertCircle, ChevronRight,
  UserPlus, Stethoscope, RefreshCw
} from 'lucide-react';

interface FairQueueHomeProps {
  setCurrentPage: (p: PageView) => void;
}

type QueueView = 'home' | 'register' | 'track' | 'staff' | 'audit' | 'public';

export const FairQueueHome: React.FC<FairQueueHomeProps & { activeView?: QueueView; setActiveView?: (v: QueueView) => void }> = ({
  setCurrentPage, activeView: externalView, setActiveView: setExternalView
}) => {
  const { isOnline, serverOnline, pendingOfflineCount, syncPending, stats, selectedDepartment } = useFairQueue();
  const { t, language } = useLanguage();
  const [internalView, setInternalView] = useState<QueueView>('home');

  const view = externalView ?? internalView;
  const setView = setExternalView ?? setInternalView;

  const [PatientReg, setPatientReg] = useState<React.FC<any> | null>(null);
  const [QueueTrack, setQueueTrack] = useState<React.FC<any> | null>(null);
  const [StaffDash, setStaffDash] = useState<React.FC<any> | null>(null);
  const [AuditLog, setAuditLog] = useState<React.FC<any> | null>(null);
  const [PublicDisplay, setPublicDisplay] = useState<React.FC<any> | null>(null);

  useEffect(() => {
    import('./PatientRegistrationPage').then(m => setPatientReg(() => m.PatientRegistrationPage));
    import('./QueueTrackingPage').then(m => setQueueTrack(() => m.QueueTrackingPage));
    import('./StaffDashboard').then(m => setStaffDash(() => m.StaffDashboard));
    import('./AuditLogPanel').then(m => setAuditLog(() => m.AuditLogPanel));
    import('./QueuePublicDisplay').then(m => setPublicDisplay(() => m.QueuePublicDisplay));
  }, []);

  if (view === 'register' && PatientReg) return <PatientReg onBack={() => setView('home')} />;
  if (view === 'track' && QueueTrack) return <QueueTrack onBack={() => setView('home')} />;
  if (view === 'staff' && StaffDash) return <StaffDash onBack={() => setView('home')} />;
  if (view === 'audit' && AuditLog) return <AuditLog onBack={() => setView('home')} />;
  if (view === 'public' && PublicDisplay) return <PublicDisplay onBack={() => setView('home')} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Ticket className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('fqTitle')}</h1>
              <p className="text-teal-100 text-sm font-semibold">{t('fqTagline')}</p>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed max-w-xl">{t('fqFairness')}</p>

          {/* Status bar */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isOnline ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100'}`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? t('online') : t('offline')}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${serverOnline ? 'bg-blue-400/30 text-blue-100' : 'bg-orange-400/30 text-orange-100'}`}>
              <Server className="w-3 h-3" />
              {serverOnline ? 'Server Connected' : t('fqServerOffline')}
            </span>
            {pendingOfflineCount > 0 && (
              <button onClick={syncPending} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/30 text-yellow-100 hover:bg-yellow-400/50 transition-colors">
                <RefreshCw className="w-3 h-3" />
                {pendingOfflineCount} {t('fqSyncPending')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fairness guarantee */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-teal-800">{t('fqFairnessGuarantee')}</p>
          <p className="text-xs text-teal-700 mt-0.5">{t('fqFairnessDetail')}</p>
        </div>
      </div>

      {/* 3 primary action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            key: 'register',
            icon: <UserPlus className="w-8 h-8" />,
            label: t('fqRegister'),
            sublabel: `${t('fqSelf')} | ${t('fqAsha')} | ${t('fqReception')}`,
            color: 'from-teal-500 to-teal-600',
            bg: 'hover:bg-teal-50 border-teal-200',
          },
          {
            key: 'track',
            icon: <Ticket className="w-8 h-8" />,
            label: t('fqTrack'),
            sublabel: 'Live position & status',
            color: 'from-blue-500 to-blue-600',
            bg: 'hover:bg-blue-50 border-blue-200',
          },
          {
            key: 'staff',
            icon: <Stethoscope className="w-8 h-8" />,
            label: t('fqStaff'),
            sublabel: 'Authorized staff only',
            color: 'from-violet-500 to-violet-600',
            bg: 'hover:bg-violet-50 border-violet-200',
          },
        ].map(card => (
          <button
            key={card.key}
            onClick={() => setView(card.key as QueueView)}
            className={`group flex flex-col items-center gap-4 p-6 bg-white border-2 ${card.bg} rounded-2xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] text-center`}
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-base leading-snug">{card.label}</p>
              <p className="text-xs text-slate-500 mt-1">{card.sublabel}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>
        ))}
      </div>

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setView('public')} className="flex items-center gap-3 p-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
          <Monitor className="w-5 h-5 text-slate-600" />
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">{t('fqPublicDisplay')}</p>
            <p className="text-xs text-slate-500">Wall screen view</p>
          </div>
        </button>
        <button onClick={() => setView('audit')} className="flex items-center gap-3 p-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
          <ClipboardList className="w-5 h-5 text-slate-600" />
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">{t('fqAuditLog')}</p>
            <p className="text-xs text-slate-500">Integrity history</p>
          </div>
        </button>
      </div>

      {/* Live stats strip */}
      {stats && selectedDepartment && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Live Queue — {selectedDepartment.name}
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Registered', value: stats.total_registered, color: 'text-slate-700' },
              { label: t('fqWaiting'), value: stats.total_waiting, color: 'text-amber-600' },
              { label: 'In Room', value: stats.total_in_consultation, color: 'text-blue-600' },
              { label: t('fqCompleted'), value: stats.total_completed, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label}>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
          {stats.currently_serving_token && (
            <div className="mt-3 text-center bg-teal-50 rounded-xl p-2">
              <p className="text-xs text-teal-600 font-bold">{t('fqNowServing')}</p>
              <p className="text-2xl font-black text-teal-800">{stats.currently_serving_token}</p>
            </div>
          )}
        </div>
      )}

      {/* Offline notice */}
      {!serverOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">{t('fqServerOffline')}</p>
            <p className="text-xs text-amber-700 mt-0.5">{t('fqOfflineBanner')}</p>
          </div>
        </div>
      )}

      {/* Demo credentials */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
        <p className="font-bold text-slate-700 mb-1">{t('fqDemoCredentials')}</p>
        <div className="space-y-0.5 font-mono">
          <p><span className="text-teal-700">admin</span> / admin1234 (Admin)</p>
          <p><span className="text-teal-700">doctor1</span> / doctor1234 (Doctor)</p>
          <p><span className="text-teal-700">reception1</span> / reception1234 (Receptionist)</p>
          <p><span className="text-teal-700">asha1</span> / asha1234 (ASHA Worker)</p>
        </div>
      </div>
    </div>
  );
};
