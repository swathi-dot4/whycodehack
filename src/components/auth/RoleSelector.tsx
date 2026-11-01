import React from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, User, Stethoscope, ArrowRight, Globe, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelected: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelected }) => {
  const { role, setRole } = useAuth();
  const { language, setLanguage } = useLanguage();

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    onRoleSelected(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      
      {/* Main Container Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 border border-slate-200 animate-fade-in">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg border border-emerald-400/30">
            <Heart className="w-9 h-9 fill-white" />
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              CareBridge AI
            </h1>
            <p className="text-sm font-bold text-emerald-700">
              Healthcare guidance in your language.
            </p>
          </div>

          {/* Language selector */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <Globe className="w-4 h-4 text-sky-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold"
            >
              <option value="te">🇮🇳 తెలుగు (Telugu)</option>
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Prompt Question */}
        <div className="text-center space-y-1 pt-2">
          <h2 className="text-xl font-black text-slate-800">
            Who are you?
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Select your role to enter the CareBridge AI healthcare ecosystem
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Patient Card */}
          <button
            onClick={() => handleSelectRole('PATIENT')}
            className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${
              role === 'PATIENT'
                ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <User className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-slate-900">Patient</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Citizen
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                Describe symptoms in your local language, scan medicine labels, and consult doctors.
              </p>
            </div>

            <div className="pt-2 flex items-center text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Patient Portal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          {/* Doctor Card */}
          <button
            onClick={() => handleSelectRole('DOCTOR')}
            className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${
              role === 'DOCTOR'
                ? 'border-sky-600 bg-sky-50/60 shadow-md ring-2 ring-sky-500/20'
                : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-slate-900">Doctor</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                  Medical Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                Receive patient requests, conduct video consultations, and send translated follow-ups.
              </p>
            </div>

            <div className="pt-2 flex items-center text-xs font-black text-sky-700 group-hover:translate-x-1 transition-transform">
              <span>Doctor Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

        </div>

        {/* Footer Philosophy */}
        <div className="pt-2 text-center text-slate-500 text-xs flex items-center justify-center gap-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-600">AI guides. Healthcare professionals decide.</span>
        </div>

      </div>

    </div>
  );
};
