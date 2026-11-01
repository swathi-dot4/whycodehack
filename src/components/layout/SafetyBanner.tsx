import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border-b border-amber-200/60 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-800 font-medium text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-semibold text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded text-[11px] uppercase tracking-wide shrink-0">
          Safety Notice
        </span>
        <span>{t('safetyDisclaimer')}</span>
      </div>
    </div>
  );
};
