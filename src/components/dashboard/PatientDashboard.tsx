import React from 'react';
import { PageView } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { 
  Bot, 
  Stethoscope, 
  Scan, 
  PhoneCall, 
  Building2, 
  WifiOff, 
  Users, 
  Calendar, 
  Bell, 
  User, 
  ShieldAlert, 
  ArrowRight,
  Heart,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

interface PatientDashboardProps {
  setCurrentPage: (page: PageView) => void;
  onSelectPrompt: (prompt: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ 
  setCurrentPage, 
  onSelectPrompt 
}) => {
  const { t } = useLanguage();
  const { patientUser, isGuest } = useAuth();
  const { followUps, requests, notifications, setEmergencyModalOpen } = useHealthcare();

  const activeFollowUps = followUps.filter(f => f.status === 'UPCOMING');
  const userRequests = requests.filter(r => r.patientId === (patientUser?.id || 'usr-101'));
  const unreadNotifs = notifications.filter(n => n.role === 'PATIENT' && !n.read);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Patient Welcome Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-sky-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-600/30 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-emerald-300 flex items-center justify-center shadow-lg">
              <Heart className="w-9 h-9 fill-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {isGuest ? 'Welcome, Guest Citizen' : `Namaste, ${patientUser?.name || 'Ravi Kumar'}`}
                </h1>
                {isGuest && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Guest Mode
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 border border-rose-400/30 animate-pulse"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Emergency Help (108)</span>
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <button 
            onClick={() => setCurrentPage('requests')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-3 text-left border border-white/10 transition-colors"
          >
            <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider block">Submitted Requests</span>
            <span className="text-xl font-black text-white">{userRequests.length} Active</span>
          </button>

          <button 
            onClick={() => setCurrentPage('followups')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-3 text-left border border-white/10 transition-colors"
          >
            <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider block">Upcoming Follow-ups</span>
            <span className="text-xl font-black text-emerald-300">{activeFollowUps.length} Pending</span>
          </button>

          <button 
            onClick={() => setCurrentPage('family')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-3 text-left border border-white/10 transition-colors"
          >
            <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider block">Family Profile</span>
            <span className="text-xl font-black text-sky-300">2 Members</span>
          </button>

          <button 
            onClick={() => setCurrentPage('notifications')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl p-3 text-left border border-white/10 transition-colors"
          >
            <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider block">Notifications</span>
            <span className="text-xl font-black text-amber-300">{unreadNotifs.length} Unread</span>
          </button>

        </div>

      </div>

      {/* Primary Action Section Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-900">
          Healthcare Ecosystem Features
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          Select a feature below to receive local-language guidance and connect with doctors
        </p>
      </div>

      {/* Grid of 11 Core Features (Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. AI Healthcare Guide */}
        <div 
          onClick={() => setCurrentPage('guide')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Voice / Text
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              🤖 AI Healthcare Guide
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Speak or type symptoms in Telugu, English, or Hindi. AI organizes your concern safely.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Open AI Guide</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 2. Explain My Problem / Request Healthcare */}
        <div 
          onClick={() => setCurrentPage('requests')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800">
              Doctor Connect
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors">
              🩺 Request Doctor Consultation
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Submit your concern to doctors, request video/voice calls, and receive responses.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-sky-700 group-hover:translate-x-1 transition-transform">
            <span>Submit Request</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 3. Medicine Scanner */}
        <div 
          onClick={() => setCurrentPage('medicine')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Scan className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Camera / OCR
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              💊 Medicine Label Scanner
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Scan medicine wrappers or bottles to view verified label instructions and safety warnings.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Scan Medicine Label</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 4. Healthcare Calls Kiosk */}
        <div 
          onClick={() => setCurrentPage('calls')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800">
              Voice Kiosk
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors">
              📞 Healthcare Call Kiosk
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Direct voice call connection with local ASHA worker Lakshmi or PHC helpline in Telugu.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-sky-700 group-hover:translate-x-1 transition-transform">
            <span>Call Healthcare Worker</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 5. Find Healthcare Facilities */}
        <div 
          onClick={() => setCurrentPage('facilities')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              PHC / CHC Locator
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              🏥 Find Healthcare Facilities
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Locate nearby Primary Health Centres, government hospitals, and emergency clinics.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Search Nearby Facilities</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 6. Offline Requests */}
        <div 
          onClick={() => setCurrentPage('offline')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <WifiOff className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
              Low Bandwidth
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
              📡 Offline Requests & Sync
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Save health concerns locally when internet is unavailable and sync automatically.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-amber-700 group-hover:translate-x-1 transition-transform">
            <span>Manage Offline Storage</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 7. Follow-ups */}
        <div 
          onClick={() => setCurrentPage('followups')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800">
              Doctor Schedule
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors">
              📅 Follow-up Reminders
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              View upcoming consultation dates, doctor notes, and medicine schedules.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-sky-700 group-hover:translate-x-1 transition-transform">
            <span>View Follow-ups</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 8. Family Health Profile */}
        <div 
          onClick={() => setCurrentPage('family')}
          className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Family Care
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              👨‍👩‍👧 Family Health Profile
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Keep track of health records, chronic conditions, and reminders for family members.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Manage Family Health</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* 9. Video Consultation Start */}
        <div 
          onClick={() => setCurrentPage('consultation')}
          className="group p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-sky-700 text-white shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              Live Call Room
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              📹 Start Video Consultation
            </h3>
            <p className="text-xs text-emerald-100 font-medium leading-relaxed mt-1">
              Join active tele-consultation room with Dr. Venkat Rao and AI Communicator helper.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-black text-white group-hover:translate-x-1 transition-transform">
            <span>Enter Consultation Room</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

      </div>

      {/* Safety Principle Footer */}
      <div className="pt-4 text-center text-slate-500 text-xs flex items-center justify-center gap-2 border-t border-slate-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-semibold text-slate-600">CareBridge AI provides guidance only. It does not replace qualified doctors.</span>
      </div>

    </div>
  );
};
