import React, { useState, useEffect } from 'react';
import { PageView } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAIContext } from '../../context/AIContextManager';
import { 
  PhoneCall, 
  UserCheck, 
  Building2, 
  Stethoscope, 
  Siren, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  PhoneOff, 
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface HealthcareCallsProps {
  activeCallData: { contactName: string; role: string; phone: string } | null;
  setActiveCallData: (data: { contactName: string; role: string; phone: string } | null) => void;
  setCurrentPage?: (page: PageView) => void;
}

export const HealthcareCalls: React.FC<HealthcareCallsProps> = ({ activeCallData, setActiveCallData, setCurrentPage }) => {
  const { t, language } = useLanguage();
  const { setAIContext } = useAIContext();

  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [callState, setCallState] = useState<'IDLE' | 'CONNECTING' | 'ACTIVE'>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const isTe = language === 'te';

  // Live Call Timer Effect
  useEffect(() => {
    let timer: any;
    if (callState === 'ACTIVE') {
      timer = setInterval(() => {
        setCallDurationSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleStartCall = (name: string, role: string, phone: string) => {
    setAIContext('HEALTHCARE_CALL');
    setActiveCallData({ contactName: name, role, phone });
    setCallState('CONNECTING');

    setTimeout(() => {
      setCallState('ACTIVE');
    }, 1800);
  };

  const handleEndCall = () => {
    setCallState('IDLE');
    setActiveCallData(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 animate-fade-in select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {setCurrentPage && (
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-black"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> One-Touch Voice Hotline
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('callTitle')}
          </h1>
          <p className="text-emerald-100 text-sm font-medium">
            {t('callSubtitle')}
          </p>
        </div>

        {/* Language selector for calls */}
        <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md text-xs font-semibold text-white border border-white/20 flex items-center gap-2">
          <span>{t('preferredLang')}:</span>
          <span className="font-bold underline">
            {language === 'te' ? '🇮🇳 Telugu (తెలుగు)' : language === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
          </span>
        </div>
      </div>

      {/* Simulated Active Call Overlay Screen */}
      {activeCallData && callState !== 'IDLE' && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border-2 border-emerald-500 animate-fade-in space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            {callState === 'CONNECTING' ? 'Connecting to Healthcare Personnel...' : `Call Active • ${formatTimer(callDurationSeconds)}`}
          </div>

          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl">
            {activeCallData.contactName.charAt(0)}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">{activeCallData.contactName}</h2>
            <p className="text-xs text-slate-400 font-semibold">{activeCallData.role}</p>
            <p className="text-xs text-emerald-400 font-mono pt-1">{activeCallData.phone}</p>
          </div>

          <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-3">
            <span>Language: <span className="text-white font-bold">{isTe ? 'Telugu (తెలుగు)' : 'English'}</span></span>
            <span>•</span>
            <span>Audio: <span className="text-emerald-400 font-bold">{isSpeakerOn ? 'Speaker' : 'Earpiece'}</span></span>
          </div>

          {/* Call Control Buttons */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full text-white transition-all shadow-md ${
                isMuted ? 'bg-rose-600 ring-4 ring-rose-500/30' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transition-transform hover:scale-105"
              title="End Call"
            >
              <PhoneOff className="w-8 h-8" />
            </button>

            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-4 rounded-full text-white transition-all shadow-md ${
                isSpeakerOn ? 'bg-sky-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title="Toggle Speaker Mode"
            >
              {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Interactive calling simulation with live audio timer.
          </p>

        </div>
      )}

      {/* 4 Main Healthcare Calling Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Call ASHA Worker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{t('ashaTitle')}</h3>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Telugu Support Available
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('ashaDesc')} • Immediate local assistance for pregnant mothers, fever triage, and medicine guidance.
            </p>
          </div>

          <button
            onClick={() => handleStartCall(
              isTe ? "శ్రీమతి లక్ష్మి (ఆశా కార్యకర్త - అనంత్‌పూర్)" : "Mrs. Lakshmi (ASHA Worker - Ananthapur)",
              "Village Health Volunteer",
              "+91 98480 11223"
            )}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('startCall')}</span>
          </button>
        </div>

        {/* 2. Call PHC */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{t('phcTitle')}</h3>
                <span className="text-xs text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  24/7 Helpline
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('phcDesc')} • Direct line to duty doctor and nurse station at Primary Health Centre.
            </p>
          </div>

          <button
            onClick={() => handleStartCall(
              "Ananthapur Rural PHC Control Room",
              "Primary Health Centre Helpline",
              "+91 8554 221100"
            )}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('startCall')}</span>
          </button>
        </div>

        {/* 3. Call Doctor */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{t('docCallTitle')}</h3>
                <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Tele-Consultation
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('docCallDesc')} • Speak directly with an on-duty medical officer to present your pre-formatted summary.
            </p>
          </div>

          <button
            onClick={() => handleStartCall(
              "Dr. K. Vijay Kumar (MD General)",
              "Government Telemedicine Doctor",
              "+91 94401 88990"
            )}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('startCall')}</span>
          </button>
        </div>

        {/* 4. Emergency Help 108 / 104 */}
        <div className="bg-rose-50 p-6 rounded-3xl border-2 border-rose-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-950">{t('emergTitle')}</h3>
                <span className="text-xs text-rose-800 font-extrabold bg-rose-200 px-2 py-0.5 rounded border border-rose-300">
                  FREE 24x7 Ambulance Dispatch
                </span>
              </div>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {t('emergDesc')} • Dial 108 for immediate critical emergency ambulance or 104 for government health advice.
            </p>
          </div>

          <button
            onClick={() => handleStartCall("Ambulance Emergency Helpline", "Dispatch Command", "108")}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Dial 108 Emergency Hotline</span>
          </button>
        </div>

      </div>

    </div>
  );
};
