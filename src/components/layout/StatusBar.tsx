import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAIContext } from '../../context/AIContextManager';
import { useOffline } from '../../context/OfflineContext';
import { Wifi, WifiOff, Globe, Cpu, BookmarkCheck, Clock } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { language, t } = useLanguage();
  const { activeContext, getContextLabel } = useAIContext();
  const { isOffline, offlineQueue } = useOffline();

  const pendingCount = offlineQueue.filter(r => r.syncStatus === 'PENDING').length;

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        
        {/* Connection & Context Group */}
        <div className="flex items-center space-x-4 flex-wrap gap-y-1">
          {/* Connection */}
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="text-slate-400">{t('statusInternet')}:</span>
            {isOffline ? (
              <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60 font-semibold">
                <WifiOff className="w-3 h-3 text-rose-400" /> 🔴 {t('offline')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-semibold">
                <Wifi className="w-3 h-3 text-emerald-400" /> 🟢 {t('online')}
              </span>
            )}
          </div>

          {/* Language */}
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="text-slate-400">{t('statusLanguage')}:</span>
            <span className="inline-flex items-center gap-1 text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60 font-semibold">
              <Globe className="w-3 h-3" />
              {language === 'te' ? '🇮🇳 తెలుగు (Telugu)' : language === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
            </span>
          </div>

          {/* AI Context */}
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="text-slate-400">{t('statusContext')}:</span>
            <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60 font-semibold">
              <Cpu className="w-3 h-3" />
              {getContextLabel(activeContext, language)}
            </span>
          </div>
        </div>

        {/* Saved Items & Follow-ups */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">{t('statusSaved')}:</span>
            <span className="font-bold text-amber-300">{pendingCount}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">{t('statusFollowups')}:</span>
            <span className="font-bold text-sky-300">2 active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
