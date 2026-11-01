import React from 'react';
import { PageView } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquareText, 
  Mic, 
  Pill, 
  PhoneCall, 
  Building2, 
  WifiOff, 
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Cpu,
  UserCheck,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenDemoTour: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage, onOpenDemoTour }) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-900/50">
        
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Rural Healthcare Access & Communication Platform</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t('appName')}
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">
            {t('tagline')}
          </p>

          {/* Supporting Text */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            {t('heroDesc')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t('primaryCta')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenDemoTour}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5 fill-slate-950 text-amber-500" />
              <span>{t('demoBtnText')}</span>
            </button>

            <button
              onClick={() => setCurrentPage('guide')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5 text-sky-400" />
              <span>{t('secondaryCta')}</span>
            </button>
          </div>

          {/* Trust Message */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('trustMessage')}</span>
          </div>

        </div>
      </section>

      {/* USP Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('uspTitle')}
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Designed to bridge language barriers, digital literacy gaps, and remote connectivity challenges in rural communities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          <div 
            onClick={() => setCurrentPage('guide')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('usp1')}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Full Telugu and English voice support. Patients can express concerns naturally without clinical jargon.
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('doctor')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-sky-400 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('usp2')}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Converts raw spoken symptom descriptions into clear clinical notes for doctors ("Explain My Problem").
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('medicine')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-amber-400 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('usp3')}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Scan medicine wrappers to view dosage form, manufacturer, and warnings with clear missing info alerts.
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('calls')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('usp4')}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              One-touch voice connection to local Telugu-speaking ASHA workers, PHC doctors, and 108 emergency help.
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('facilities')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-sky-400 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('usp5')}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Locate rural PHCs, CHCs, and hospitals with distance, services, language support badges, and directions.
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('offline')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-indigo-400 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('usp6')}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Stores voice requests locally when internet drops, auto-syncing seamlessly once connectivity returns.
            </p>
          </div>

        </div>
      </section>

      {/* AI Architecture Visualization Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Technical Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How CareBridge AI AI Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Ethical, non-diagnostic AI pipeline engineered to assist patient-doctor communication.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center text-center">
          
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
            <Mic className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="text-xs font-bold text-white">1. Patient Input</div>
            <div className="text-[11px] text-slate-400">Voice (Telugu/Hindi) or Text</div>
          </div>

          <div className="hidden md:block text-slate-500 font-bold">➔</div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
            <Globe className="w-6 h-6 text-sky-400 mx-auto" />
            <div className="text-xs font-bold text-white">2. Language & Voice</div>
            <div className="text-[11px] text-slate-400">Web Speech & Translation</div>
          </div>

          <div className="hidden md:block text-slate-500 font-bold">➔</div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
            <Cpu className="w-6 h-6 text-amber-400 mx-auto" />
            <div className="text-xs font-bold text-white">3. Context Manager</div>
            <div className="text-[11px] text-slate-400">Intent & Safety Filter</div>
          </div>

          <div className="hidden md:block text-slate-500 font-bold">➔</div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
            <MessageSquareText className="w-6 h-6 text-indigo-400 mx-auto" />
            <div className="text-xs font-bold text-white">4. Clinical Summary</div>
            <div className="text-[11px] text-slate-400">Doctor Note & Speech</div>
          </div>

          <div className="hidden md:block text-slate-500 font-bold">➔</div>

          <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800 space-y-1">
            <UserCheck className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="text-xs font-bold text-emerald-300">5. Professional Care</div>
            <div className="text-[11px] text-emerald-400">Doctor / ASHA Worker</div>
          </div>

        </div>

        {/* Philosophy Card */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-6 text-center max-w-2xl mx-auto space-y-2">
          <h4 className="text-emerald-300 font-extrabold text-lg sm:text-xl tracking-tight">
            “AI should act as a GUIDE, not a JUDGE.”
          </h4>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            The AI does not diagnose diseases or prescribe medicine. It empowers patients to organize their health concerns and connect with licensed medical professionals.
          </p>
        </div>
      </section>

    </div>
  );
};
