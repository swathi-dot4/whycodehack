import React from 'react';
import { PageView } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useOffline } from '../../context/OfflineContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Database, 
  Sparkles, 
  PlusCircle,
  ShieldCheck,
  Send
} from 'lucide-react';

interface OfflineManagerProps {
  setCurrentPage: (page: PageView) => void;
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({ setCurrentPage }) => {
  const { t, language } = useLanguage();
  const { 
    isOffline, 
    toggleOfflineMode, 
    offlineQueue, 
    syncOfflineRequests, 
    isSyncing, 
    syncSuccessMessage 
  } = useOffline();

  const isTe = language === 'te';

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-900/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Rural Low-Connectivity Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('offTitle')}
          </h1>
          <p className="text-slate-300 text-sm font-medium max-w-xl">
            {t('offSubtitle')}
          </p>
        </div>

        {/* Demo Offline Toggle Switch for SIH Judges */}
        <button
          onClick={toggleOfflineMode}
          className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center gap-2.5 ${
            isOffline
              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-500/30'
          }`}
        >
          {isOffline ? <WifiOff className="w-5 h-5 animate-pulse" /> : <Wifi className="w-5 h-5" />}
          <span>{t('simOfflineToggle')} ({isOffline ? 'OFFLINE ACTIVE' : 'ONLINE ACTIVE'})</span>
        </button>
      </div>

      {/* Sync Status Banner */}
      {syncSuccessMessage && (
        <div className="p-4 bg-emerald-100 rounded-2xl border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in shadow">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>{syncSuccessMessage}</span>
        </div>
      )}

      {isSyncing && (
        <div className="p-4 bg-sky-100 rounded-2xl border border-sky-300 text-sky-950 text-xs sm:text-sm font-bold flex items-center gap-3 animate-pulse shadow">
          <RefreshCw className="w-6 h-6 text-sky-600 animate-spin shrink-0" />
          <span>{t('syncingText')}</span>
        </div>
      )}

      {/* Queue Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Storage State</div>
          <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
            <Database className="w-5 h-5 text-indigo-600" />
            <span>IndexedDB Active</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Local device persistence enabled</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pending Offline Items</div>
          <div className="text-xl font-black text-amber-600 flex items-center gap-1.5">
            <Clock className="w-5 h-5" />
            <span>{offlineQueue.filter(r => r.syncStatus === 'PENDING').length} Items</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Waiting for network reconnect</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Synced Records</div>
          <div className="text-xl font-black text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>{offlineQueue.filter(r => r.syncStatus === 'SYNCED').length} Synced</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Successfully received by PHC</p>
        </div>

      </div>

      {/* Queue List Table/Card view */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Saved Healthcare Requests Queue</span>
          </h3>

          {!isOffline && offlineQueue.some(r => r.syncStatus === 'PENDING') && (
            <button
              onClick={syncOfflineRequests}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {offlineQueue.map((req) => (
            <div 
              key={req.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">
                    {req.type}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{req.title}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{req.content}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Saved: {req.createdAt} • Language: {req.language === 'te' ? 'Telugu' : 'English'}
                </div>
              </div>

              <div className="shrink-0">
                {req.syncStatus === 'SYNCED' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    <Clock className="w-3.5 h-3.5" /> Saved Offline
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
