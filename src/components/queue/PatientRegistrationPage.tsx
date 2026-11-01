import React, { useState, useEffect } from 'react';
import { useFairQueue } from '../../context/FairQueueContext';
import { useLanguage } from '../../context/LanguageContext';
import { QueueToken, PatientRegistrationForm } from '../../types';
import { ArrowLeft, UserPlus, Users, Building2, Stethoscope, CheckCircle, Printer, Volume2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

type RegMethod = 'SELF' | 'ASHA_WORKER' | 'RECEPTIONIST';
type Step = 'method' | 'facility' | 'form' | 'success';

interface Props { onBack: () => void; }

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'as', label: 'অসমীয়া' },
];

export const PatientRegistrationPage: React.FC<Props> = ({ onBack }) => {
  const { facilities, departments, loadDepartments, registerPatient, isOnline, serverOnline, selectedFacility, setSelectedFacility, selectedDepartment, setSelectedDepartment } = useFairQueue();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<RegMethod>('SELF');
  const [issuedToken, setIssuedToken] = useState<QueueToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<PatientRegistrationForm>({
    name: '',
    age: undefined,
    gender: '',
    mobile: '',
    preferred_language: 'en',
    registered_by: 'SELF',
    facility_id: '',
    department_id: '',
  });

  // When facility changes, load departments
  useEffect(() => {
    if (form.facility_id) loadDepartments(form.facility_id);
  }, [form.facility_id]);

  const handleFacilitySelect = (fac: any) => {
    setSelectedFacility(fac);
    setForm(f => ({ ...f, facility_id: fac.id, department_id: '' }));
    setSelectedDepartment(null);
  };

  const handleDeptSelect = (dept: any) => {
    setSelectedDepartment(dept);
    setForm(f => ({ ...f, department_id: dept.id }));
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Patient name is required'); return; }
    if (!form.facility_id || !form.department_id) { setError('Please select facility and department'); return; }
    setLoading(true);
    try {
      const token = await registerPatient({ ...form, registered_by: method });
      setIssuedToken(token);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const announceToken = () => {
    if (!issuedToken || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(`Your token number is ${issuedToken.token_number}. Please wait for your turn.`);
    u.lang = 'en-IN'; u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const printToken = () => {
    const w = window.open('', '_blank', 'width=400,height=600');
    if (!w || !issuedToken) return;
    const fac = facilities.find(f => f.id === issuedToken.facility_id);
    w.document.write(`
      <html><head><title>Queue Token</title><style>
        body{font-family:Arial,sans-serif;padding:20px;text-align:center;background:#fff}
        .token{font-size:72px;font-weight:900;color:#0f766e;border:4px solid #0f766e;border-radius:16px;padding:20px;margin:20px 0}
        .label{font-size:14px;color:#666;margin:4px 0}
        .big{font-size:18px;font-weight:bold;color:#222}
        .note{font-size:11px;color:#888;margin-top:20px;border-top:1px solid #eee;padding-top:12px}
      </style></head><body>
        <h2 style="color:#0f766e">CareBridge AI – Smart FairQueue</h2>
        <p class="label">${fac?.name || 'Hospital'}</p>
        <div class="token">${issuedToken.token_number}</div>
        <p class="label">Department</p><p class="big">${issuedToken.department_name}</p>
        <p class="label">Registered At</p><p class="big">${new Date(issuedToken.registered_at).toLocaleTimeString('en-IN')}</p>
        ${issuedToken.tokens_ahead !== undefined ? `<p class="label">Patients Ahead</p><p class="big">${issuedToken.tokens_ahead}</p>` : ''}
        ${issuedToken.estimated_wait_minutes ? `<p class="label">Estimated Wait</p><p class="big">~${issuedToken.estimated_wait_minutes} minutes</p>` : ''}
        <div class="note">Every patient deserves fair access to healthcare.<br>Your queue position is transparent and traceable.</div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  // ─── Step: Method selection ──────────────────────────────────────────────
  if (step === 'method') return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-1">{t('fqRegister')}</h2>
        <p className="text-sm text-slate-500 mb-6">Choose how you are registering this patient</p>

        {!isOnline && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold text-amber-800">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            Offline – token will be saved locally and synced when connected
          </div>
        )}

        <div className="space-y-3">
          {[
    { key: 'SELF', icon: <UserPlus className="w-7 h-7" />, title: t('fqSelf'), desc: 'Patient registers using their own phone', color: 'border-teal-200 hover:bg-teal-50', active: 'bg-teal-50 border-teal-500' },
            { key: 'ASHA_WORKER', icon: <Users className="w-7 h-7" />, title: t('fqAsha'), desc: 'Community health worker registers on behalf', color: 'border-indigo-200 hover:bg-indigo-50', active: 'bg-indigo-50 border-indigo-500' },
            { key: 'RECEPTIONIST', icon: <Building2 className="w-7 h-7" />, title: t('fqReception'), desc: 'Walk-in registration at hospital counter', color: 'border-violet-200 hover:bg-violet-50', active: 'bg-violet-50 border-violet-500' },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => { setMethod(m.key as RegMethod); setStep('facility'); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${method === m.key ? m.active : `bg-white ${m.color}`}`}
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">{m.icon}</div>
              <div className="flex-1">
                <p className="font-extrabold text-slate-900">{m.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Step: Facility & Department ─────────────────────────────────────────
  if (step === 'facility') return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <button onClick={() => setStep('method')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-1">{t('fqSelectHospital')}</h2>
        <p className="text-sm text-slate-500 mb-5">Choose your healthcare facility</p>

        {!serverOnline ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <WifiOff className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-amber-800">{t('fqServerOffline')}</p>
            <p className="text-xs text-amber-600 mt-1">Registration is still available. You can proceed with a local token.</p>
            <button
              onClick={() => {
                setForm(f => ({ ...f, facility_id: 'offline-fac', department_id: 'offline-dept' }));
                setStep('form');
              }}
              className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-xl"
            >
              {t('fqContinueOffline')}
            </button>
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-8">Loading facilities...</p>
        ) : (
          <div className="space-y-2">
            {facilities.map(fac => (
              <button
                key={fac.id}
                onClick={() => handleFacilitySelect(fac)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all hover:bg-teal-50 ${form.facility_id === fac.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}
              >
                <Building2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">{fac.name}</p>
                  <p className="text-xs text-slate-500">{fac.facility_type} • {fac.city}, {fac.district}</p>
                  {fac.contact_number && <p className="text-xs text-slate-400 mt-0.5">{fac.contact_number}</p>}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Department selection */}
        {form.facility_id && departments.length > 0 && (
          <div className="mt-5">
            <h3 className="font-bold text-slate-800 mb-3">{t('fqSelectDept')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => handleDeptSelect(dept)}
                  className="flex flex-col items-center gap-1 p-4 bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 rounded-xl transition-all"
                >
                  <span className="text-2xl font-black text-teal-700">{dept.code}</span>
                  <span className="text-xs font-bold text-slate-700 text-center leading-tight">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Step: Patient Form ──────────────────────────────────────────────────
  if (step === 'form') return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <button onClick={() => setStep('facility')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Patient Details</h2>
            <p className="text-xs text-slate-500">{method === 'SELF' ? 'Self' : method === 'ASHA_WORKER' ? 'ASHA Worker' : 'Reception'} Registration</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{t('fqPatientName')} <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Enter full name"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-base font-semibold transition-colors"
            />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('fqAge')} <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="number"
                value={form.age || ''}
                onChange={e => setForm(f => ({ ...f, age: e.target.value ? parseInt(e.target.value) : undefined }))}
                placeholder="Age"
                min={0} max={130}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-base font-semibold transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('fqGender')} <span className="text-slate-400 font-normal">(optional)</span></label>
              <select
                value={form.gender || ''}
                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-base font-semibold transition-colors bg-white"
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{t('fqMobile')} <span className="text-slate-400 font-normal">(optional)</span></label>
            <input
              type="tel"
              value={form.mobile || ''}
              onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
              placeholder="Not required to get a token"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-base font-semibold transition-colors"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('preferredLang')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, preferred_language: l.code }))}
                  className={`py-2.5 px-2 rounded-xl text-sm font-bold border-2 transition-all ${form.preferred_language === l.code ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-300'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Registering...' : t('fqGetToken')}
          </button>
        </form>
      </div>
    </div>
  );

  // ─── Step: Success / Token Card ──────────────────────────────────────────
  if (step === 'success' && issuedToken) return (
    <div className="max-w-md mx-auto space-y-4 animate-fade-in">
      <div className="bg-white border-2 border-teal-300 rounded-3xl p-6 shadow-xl text-center" id="token-card-print">
        <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-3" />
        <p className="text-sm font-bold text-teal-700 uppercase tracking-widest mb-1">Your Token</p>
        <div className="bg-teal-50 border-4 border-teal-400 rounded-2xl py-5 px-8 my-4">
          <p className="text-6xl sm:text-7xl font-black text-teal-800 tracking-tight">{issuedToken.token_number}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left my-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Department</p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{issuedToken.department_name}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Registered At</p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{new Date(issuedToken.registered_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          {issuedToken.tokens_ahead !== undefined && (
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-amber-600 uppercase">Patients Ahead</p>
              <p className="text-xl font-black text-amber-800 mt-0.5">{issuedToken.tokens_ahead}</p>
            </div>
          )}
          {issuedToken.estimated_wait_minutes && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Est. Wait</p>
              <p className="text-xl font-black text-blue-800 mt-0.5">~{issuedToken.estimated_wait_minutes} min</p>
            </div>
          )}
        </div>

        {issuedToken.token_number.includes('[OFFLINE]') && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-xs text-amber-800 font-semibold">
            ⚠️ Offline token — will sync when connected
          </div>
        )}

        <p className="text-xs text-slate-500 italic">Every patient deserves fair access to healthcare. Your queue position is transparent and traceable.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={announceToken}
          className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-teal-200 hover:bg-teal-50 text-teal-700 font-bold rounded-xl transition-colors"
        >
          <Volume2 className="w-4 h-4" /> Read Aloud
        </button>
        <button
          onClick={printToken}
          className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Token
        </button>
      </div>

      <button onClick={onBack} className="w-full py-3 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 transition-colors">
        {t('fqBackToHome')}
      </button>
    </div>
  );

  return null;
};
