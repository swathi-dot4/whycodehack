import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language, UserRole } from '../../types';
import { RoleSelector } from './RoleSelector';
import { 
  Heart, 
  Phone, 
  Lock, 
  User, 
  MapPin, 
  Globe, 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope,
  Building,
  Mail,
  Award,
  AlertCircle
} from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const { 
    role, 
    setRole, 
    loginPatientWithOtp, 
    registerPatient, 
    continueAsGuest,
    loginDoctor,
    registerDoctor
  } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [step, setStep] = useState<'ROLE_SELECT' | 'PATIENT_AUTH' | 'DOCTOR_AUTH'>('ROLE_SELECT');
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Patient Login state
  const [patMobile, setPatMobile] = useState('');
  const [patOtp, setPatOtp] = useState('');
  const [patOtpSent, setPatOtpSent] = useState(false);
  const [patOtpError, setPatOtpError] = useState('');

  // Patient Register state
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regAge, setRegAge] = useState(42);
  const [regGender, setRegGender] = useState('Male');
  const [regLang, setRegLang] = useState<Language>('te');
  const [regLocation, setRegLocation] = useState('Ananthapur Rural, AP');
  const [regEmergency, setRegEmergency] = useState('+91 99887 11223');

  // Doctor Auth state
  const [docIdOrMobile, setDocIdOrMobile] = useState('APMC/2018/8892');
  const [docPassword, setDocPassword] = useState('demo1234');
  const [docAuthError, setDocAuthError] = useState('');

  // Doctor Register state
  const [docRegName, setDocRegName] = useState('');
  const [docRegId, setDocRegId] = useState('');
  const [docRegMobile, setDocRegMobile] = useState('');
  const [docRegEmail, setDocRegEmail] = useState('');
  const [docRegSpec, setDocRegSpec] = useState('General Medicine & Rural Health');
  const [docRegLang, setDocRegLang] = useState<Language>('en');
  const [docRegFacility, setDocRegFacility] = useState('Ananthapur Area Govt Hospital & CHC');
  const [docRegLocation, setDocRegLocation] = useState('Ananthapur Urban, AP');

  const handleRoleSelection = (selectedRole: UserRole) => {
    if (selectedRole === 'PATIENT') {
      setStep('PATIENT_AUTH');
    } else {
      setStep('DOCTOR_AUTH');
    }
  };

  // Patient Handlers
  const handleSendPatOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (patMobile.length >= 10) {
      setPatOtpSent(true);
      setPatOtpError('');
    }
  };

  const handleVerifyPatOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginPatientWithOtp(patMobile, patOtp);
    if (success) {
      onAuthSuccess();
    } else {
      setPatOtpError('Invalid OTP. Use mock code 123456 or any 6-digit code.');
    }
  };

  const handlePatientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regMobile.trim()) return;

    setLanguage(regLang);
    registerPatient({
      name: regName.trim(),
      mobile: regMobile.startsWith('+91') ? regMobile : `+91 ${regMobile}`,
      age: Number(regAge),
      gender: regGender,
      preferredLanguage: regLang,
      location: regLocation.trim(),
      emergencyContact: regEmergency.trim()
    });

    onAuthSuccess();
  };

  const handleGuestMode = () => {
    continueAsGuest();
    onAuthSuccess();
  };

  // Doctor Handlers
  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginDoctor(docIdOrMobile, docPassword);
    if (success) {
      onAuthSuccess();
    } else {
      setDocAuthError('Verification failed. Use password/OTP (e.g. 1234)');
    }
  };

  const handleDoctorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docRegName.trim() || !docRegId.trim() || !docRegMobile.trim()) return;

    registerDoctor({
      name: docRegName.trim(),
      doctorId: docRegId.trim(),
      mobile: docRegMobile.startsWith('+91') ? docRegMobile : `+91 ${docRegMobile}`,
      email: docRegEmail.trim(),
      specialization: docRegSpec,
      preferredLanguage: docRegLang,
      facility: docRegFacility.trim(),
      location: docRegLocation.trim()
    });

    onAuthSuccess();
  };

  if (step === 'ROLE_SELECT') {
    return <RoleSelector onRoleSelected={handleRoleSelection} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      
      {/* Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-200 animate-fade-in relative">
        
        {/* Back to Role Selection */}
        <button
          onClick={() => setStep('ROLE_SELECT')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to Role Selection</span>
        </button>

        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-2xl ${step === 'PATIENT_AUTH' ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500' : 'bg-gradient-to-tr from-sky-600 to-sky-500'} text-white flex items-center justify-center mx-auto shadow-md`}>
            {step === 'PATIENT_AUTH' ? (
              <Heart className="w-8 h-8 fill-white" />
            ) : (
              <Stethoscope className="w-8 h-8" />
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            {step === 'PATIENT_AUTH' ? 'Patient Access' : 'Doctor Portal'}
          </h1>
          
          <p className="text-xs font-bold text-slate-500">
            CareBridge AI — Healthcare guidance in your language.
          </p>

          {/* Role badge */}
          <div className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-slate-100 text-slate-700">
            Current Role: <span className={step === 'PATIENT_AUTH' ? 'text-emerald-700' : 'text-sky-700'}>{step === 'PATIENT_AUTH' ? 'PATIENT' : 'DOCTOR'}</span>
          </div>
        </div>

        {/* Tab Switcher: [ Login ] [ Register ] */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => { setActiveTab('LOGIN'); setPatOtpSent(false); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-white text-slate-900 shadow'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab('REGISTER')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'REGISTER'
                ? 'bg-white text-slate-900 shadow'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* PATIENT AUTHENTICATION */}
        {step === 'PATIENT_AUTH' && (
          <>
            {activeTab === 'LOGIN' && (
              <div className="space-y-4">
                {!patOtpSent ? (
                  <form onSubmit={handleSendPatOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold text-slate-700">📱 Mobile Number</label>
                      <div className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-3 py-3 text-sm focus-within:border-emerald-500">
                        <span className="font-bold text-slate-500 pr-2 border-r border-slate-300">+91</span>
                        <input
                          type="tel"
                          value={patMobile}
                          onChange={(e) => setPatMobile(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                          className="w-full bg-transparent pl-3 font-extrabold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={patMobile.length < 10}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-xs shadow transition-all"
                    >
                      Send OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPatOtp} className="space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs text-slate-500">OTP sent to +91 {patMobile}</span>
                      <p className="text-[11px] text-emerald-700 font-bold">Use mock OTP: 123456</p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold text-slate-700 text-center">Enter 6-Digit OTP</label>
                      <input
                        type="text"
                        value={patOtp}
                        onChange={(e) => setPatOtp(e.target.value)}
                        placeholder="1 2 3 4 5 6"
                        maxLength={6}
                        required
                        className="w-full text-center tracking-[0.5em] text-xl font-black py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {patOtpError && (
                      <p className="text-xs text-rose-600 font-bold text-center">{patOtpError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={patOtp.length < 6}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-xs shadow transition-all"
                    >
                      Verify OTP & Login
                    </button>

                    <button
                      type="button"
                      onClick={() => setPatOtpSent(false)}
                      className="w-full py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 text-center"
                    >
                      ← Change Mobile Number
                    </button>
                  </form>
                )}

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-400 font-semibold bg-white px-2">OR</div>
                </div>

                <button
                  onClick={handleGuestMode}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>Continue as Guest</span>
                </button>
              </div>
            )}

            {activeTab === 'REGISTER' && (
              <form onSubmit={handlePatientRegister} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ravi Kumar"
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700">Mobile Number</label>
                    <input
                      type="tel"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder="98480 12345"
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700">Age</label>
                    <input
                      type="number"
                      value={regAge}
                      onChange={(e) => setRegAge(Number(e.target.value))}
                      min="1"
                      max="120"
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700">Preferred Language</label>
                    <select
                      value={regLang}
                      onChange={(e: any) => setRegLang(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                      <option value="en">🇬🇧 English</option>
                      <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Location / Village</label>
                  <input
                    type="text"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="e.g. Ananthapur Rural, AP"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Optional Emergency Contact</label>
                  <input
                    type="tel"
                    value={regEmergency}
                    onChange={(e) => setRegEmergency(e.target.value)}
                    placeholder="+91 99887 11223"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow transition-all mt-2"
                >
                  Register & Continue to Dashboard
                </button>
              </form>
            )}
          </>
        )}

        {/* DOCTOR AUTHENTICATION */}
        {step === 'DOCTOR_AUTH' && (
          <>
            {activeTab === 'LOGIN' && (
              <form onSubmit={handleDoctorLogin} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Doctor ID / Registered Mobile</label>
                  <input
                    type="text"
                    value={docIdOrMobile}
                    onChange={(e) => setDocIdOrMobile(e.target.value)}
                    placeholder="APMC/2018/8892 or +91 94400 55667"
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Password OR OTP</label>
                  <input
                    type="password"
                    value={docPassword}
                    onChange={(e) => setDocPassword(e.target.value)}
                    placeholder="Enter password or OTP"
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {docAuthError && (
                  <p className="text-xs text-rose-600 font-bold text-center">{docAuthError}</p>
                )}

                {/* Demo note */}
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-sky-800 text-[11px] font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Demo Mode: Enter any Doctor ID & Password to access Doctor Dashboard.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow transition-all"
                >
                  Login as Doctor
                </button>
              </form>
            )}

            {activeTab === 'REGISTER' && (
              <form onSubmit={handleDoctorRegister} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Full Name (Doctor)</label>
                  <input
                    type="text"
                    value={docRegName}
                    onChange={(e) => setDocRegName(e.target.value)}
                    placeholder="Dr. Venkat Rao"
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700">Medical Registration #</label>
                    <input
                      type="text"
                      value={docRegId}
                      onChange={(e) => setDocRegId(e.target.value)}
                      placeholder="APMC/2018/8892"
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700">Mobile Number</label>
                    <input
                      type="tel"
                      value={docRegMobile}
                      onChange={(e) => setDocRegMobile(e.target.value)}
                      placeholder="94400 55667"
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={docRegEmail}
                      onChange={(e) => setDocRegEmail(e.target.value)}
                      placeholder="dr.venkat@CareBridge AI.org"
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700">Preferred Language</label>
                    <select
                      value={docRegLang}
                      onChange={(e: any) => setDocRegLang(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="en">🇬🇧 English</option>
                      <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                      <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Specialization</label>
                  <input
                    type="text"
                    value={docRegSpec}
                    onChange={(e) => setDocRegSpec(e.target.value)}
                    placeholder="General Medicine / Pediatrics"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Healthcare Facility / Hospital</label>
                  <input
                    type="text"
                    value={docRegFacility}
                    onChange={(e) => setDocRegFacility(e.target.value)}
                    placeholder="Ananthapur Area Govt Hospital & CHC"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                {/* Verification Notice */}
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-bold text-center">
                  Doctor verification — Demo
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow transition-all"
                >
                  Register Doctor Account
                </button>
              </form>
            )}
          </>
        )}

        {/* Footer Philosophy */}
        <div className="pt-2 text-center text-slate-500 text-xs flex items-center justify-center gap-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-600">AI guides. Healthcare professionals decide.</span>
        </div>

      </div>

    </div>
  );
};
