import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { AICommunicator } from './AICommunicator';
import { PageView } from '../../types';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Stethoscope, 
  Activity, 
  Sparkles, 
  Calendar, 
  FileText, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface VideoConsultationProps {
  setCurrentPage: (page: PageView) => void;
}

export const VideoConsultation: React.FC<VideoConsultationProps> = ({ setCurrentPage }) => {
  const { role, activeUser } = useAuth();
  const { activeConsultation, endVideoConsultation } = useHealthcare();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [consultNotes, setConsultNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-09-09');
  const [callDurationSec, setCallDurationSec] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSec(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSec.toString().padStart(2, '0')}`;
  };

  const handleConfirmEndCall = () => {
    if (activeConsultation) {
      endVideoConsultation(activeConsultation.id, consultNotes, followUpDate);
    }
    setShowEndModal(false);
    if (role === 'DOCTOR') {
      setCurrentPage('doctor_dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col space-y-4 animate-fade-in select-none">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(role === 'DOCTOR' ? 'doctor_dashboard' : 'dashboard')}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900">
                CareBridge AI Tele-Consultation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 animate-pulse border border-rose-200">
                ● Live ({formatDuration(callDurationSec)})
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Patient: <strong className="text-slate-800">Ravi Kumar</strong> • Doctor: <strong className="text-slate-800">Dr. Venkat Rao, MD</strong>
            </p>
          </div>
        </div>

        {/* Demo Tag */}
        <div className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-extrabold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo / Simulation</span>
        </div>
      </div>

      {/* Main Grid: Video Stream + AI Communicator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Side: Video Stream Boxes (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Main Video Window */}
          <div className="relative aspect-video w-full rounded-3xl bg-slate-950 overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
            
            {/* Primary Remote Video Simulation */}
            {role === 'PATIENT' ? (
              // Patient view showing Doctor
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-b from-sky-950/40 via-slate-900 to-slate-950">
                <div className="w-24 h-24 rounded-full bg-sky-600/30 border-2 border-sky-400 text-sky-200 flex items-center justify-center shadow-inner animate-pulse">
                  <Stethoscope className="w-12 h-12" />
                </div>
                <div className="mt-4 text-center">
                  <span className="text-base font-extrabold text-white">Dr. Venkat Rao, MD</span>
                  <p className="text-xs text-sky-300 font-medium">General Medicine • Ananthapur Area Govt Hospital</p>
                </div>
                {/* Live sound indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-2xl border border-slate-700 text-xs text-emerald-400 font-bold">
                  <Activity className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>Doctor Audio Connected</span>
                </div>
              </div>
            ) : (
              // Doctor view showing Patient
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950">
                <div className="w-24 h-24 rounded-full bg-emerald-600/30 border-2 border-emerald-400 text-emerald-200 flex items-center justify-center shadow-inner animate-pulse">
                  <User className="w-12 h-12" />
                </div>
                <div className="mt-4 text-center">
                  <span className="text-base font-extrabold text-white">Ravi Kumar (42M)</span>
                  <p className="text-xs text-emerald-300 font-medium">Ananthapur Rural Village • Telugu Speaker</p>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-2xl border border-slate-700 text-xs text-emerald-400 font-bold">
                  <Activity className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>Patient Audio Connected</span>
                </div>
              </div>
            )}

            {/* Self PIP View (Bottom Right) */}
            <div className="absolute bottom-4 right-4 w-28 h-20 sm:w-36 sm:h-24 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-xl overflow-hidden flex items-center justify-center">
              {isCamOn ? (
                <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">
                    You ({role})
                  </span>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-500">
                  <VideoOff className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Video Controls Bar overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur px-4 py-2 rounded-2xl border border-slate-700 shadow-2xl">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl font-bold text-white transition-all ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsCamOn(!isCamOn)}
                className={`p-3 rounded-xl font-bold text-white transition-all ${
                  isCamOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
                title={isCamOn ? "Turn Off Camera" : "Turn On Camera"}
              >
                {isCamOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowEndModal(true)}
                className="p-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            </div>

          </div>

          {/* Quick Consultation Info Card */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                Active Consultation Summary
              </span>
              <span className="text-slate-500 font-bold">Chief Concern: High Fever & Chills</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Patient described 3 days of fever with shivering. Temperature registered at 101°F. No previous drug allergies reported.
            </p>
          </div>

        </div>

        {/* Right Side: AI Communicator Helper (5 Cols) */}
        <div className="lg:col-span-5">
          <AICommunicator 
            patientLanguage="te"
            doctorLanguage="en"
          />
        </div>

      </div>

      {/* End Consultation Confirmation Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <PhoneOff className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                End Tele-Consultation?
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Complete consultation summary and schedule follow-up
              </p>
            </div>

            {role === 'DOCTOR' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Consultation Notes</label>
                  <textarea
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    placeholder="Enter prescribed dosage advice, rest instructions, or observations..."
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Schedule Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-bold"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmEndCall}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow"
              >
                End Call & Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
