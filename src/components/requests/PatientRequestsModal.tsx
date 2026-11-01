import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { PageView, Language } from '../../types';
import { Send, ArrowLeft, ShieldCheck, CheckCircle2, Clock, Video, MessageSquare, PhoneCall, Building } from 'lucide-react';

interface PatientRequestsModalProps {
  setCurrentPage: (page: PageView) => void;
}

export const PatientRequestsModal: React.FC<PatientRequestsModalProps> = ({ setCurrentPage }) => {
  const { patientUser } = useAuth();
  const { requests, submitHealthcareRequest } = useHealthcare();

  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<Language>(patientUser?.preferredLanguage || 'te');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('High');
  const [consultType, setConsultType] = useState<'Video' | 'Voice' | 'Chat' | 'Healthcare Facility'>('Video');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitHealthcareRequest({
      patientId: patientUser?.id || 'usr-101',
      patientName: patientUser?.name || 'Ravi Kumar',
      patientAge: patientUser?.age || 42,
      patientGender: patientUser?.gender || 'Male',
      patientMobile: patientUser?.mobile || '+91 98480 12345',
      description: description.trim(),
      language,
      urgency,
      consultationType: consultType,
      location: patientUser?.location || 'Ananthapur Rural Village, AP'
    });

    setSubmittedSuccess(true);
    setDescription('');
  };

  const userRequests = requests.filter(r => r.patientId === (patientUser?.id || 'usr-101'));

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Healthcare Guidance Requests
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Submit your health problem to connect with registered doctors
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Request Form + History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Submit Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" />
            Request Healthcare Support
          </h2>

          {submittedSuccess ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-slate-900">
                Request Sent Successfully!
              </h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Your request has been dispatched to doctors. You will receive a notification as soon as a doctor accepts.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Describe Your Symptoms / Problem
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe how you are feeling in your own words (e.g., severe fever with shivering for 3 days)..."
                  rows={4}
                  required
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Language</label>
                  <select
                    value={language}
                    onChange={(e: any) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-900"
                  >
                    <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-900"
                  >
                    <option value="High">High Priority</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Consultation Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { type: 'Video', icon: Video },
                    { type: 'Voice', icon: PhoneCall },
                    { type: 'Chat', icon: MessageSquare },
                    { type: 'Healthcare Facility', icon: Building }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => setConsultType(item.type as any)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          consultType === item.type
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] font-extrabold">{item.type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow transition-all"
              >
                Submit Healthcare Request
              </button>

            </form>
          )}

        </div>

        {/* Right 5 cols: Request History */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-lg font-black text-slate-900">
            My Submitted Requests ({userRequests.length})
          </h2>

          <div className="space-y-3">
            {userRequests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                    req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {req.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">{req.createdAt}</span>
                </div>

                <p className="text-xs font-bold text-slate-800">
                  "{req.description}"
                </p>

                {req.status === 'ACCEPTED' && (
                  <button
                    onClick={() => setCurrentPage('consultation')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Consultation</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
