import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { HealthcareRequest, PageView, UserRole } from '../../types';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  Video, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Bell, 
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface DoctorDashboardProps {
  setCurrentPage: (page: PageView) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ setCurrentPage }) => {
  const { doctorUser, setRole } = useAuth();
  const { 
    requests, 
    acceptHealthcareRequest, 
    rejectHealthcareRequest, 
    startVideoConsultation,
    followUps,
    notifications,
    scheduleFollowUp
  } = useHealthcare();

  const [selectedPatientRequest, setSelectedPatientRequest] = useState<HealthcareRequest | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<'ALL' | 'High' | 'Emergency' | 'Medium' | 'Low'>('ALL');
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'ACTIVE' | 'FOLLOWUPS' | 'NOTIFICATIONS'>('REQUESTS');

  // Follow up creation modal state
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-09-10');

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const acceptedRequests = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_CONSULTATION');
  const emergencyRequests = requests.filter(r => r.urgency === 'Emergency' || r.urgency === 'High');

  const filteredRequests = pendingRequests.filter(r => {
    if (filterUrgency === 'ALL') return true;
    return r.urgency === filterUrgency;
  });

  const handleAcceptAndConsult = (req: HealthcareRequest) => {
    acceptHealthcareRequest(req.id, doctorUser?.id || 'doc-501', doctorUser?.name || 'Dr. Venkat Rao, MD');
    startVideoConsultation(req.patientId, doctorUser?.id || 'doc-501', req.patientName, doctorUser?.name || 'Dr. Venkat Rao, MD');
    setCurrentPage('consultation');
  };

  const handleCreateFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientRequest) return;

    scheduleFollowUp({
      patientId: selectedPatientRequest.patientId,
      patientName: selectedPatientRequest.patientName,
      doctorId: doctorUser?.id || 'doc-501',
      doctorName: doctorUser?.name || 'Dr. Venkat Rao, MD',
      date: followUpDate,
      time: '10:30 AM',
      status: 'UPCOMING',
      notes: followUpNotes || 'Routine consultation follow-up.',
      instructionsEn: 'Take prescribed medicines regularly.',
      instructionsTe: 'సూచించిన మందులను క్రమం తప్పకుండా వేసుకోండి.',
      reminderSet: true
    });

    setShowFollowUpModal(false);
    setFollowUpNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-700/50 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-sky-300 flex items-center justify-center shadow-lg">
              <Stethoscope className="w-9 h-9" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {doctorUser?.name || 'Dr. Venkat Rao, MD'}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified Doctor — Demo
                </span>
              </div>

              <p className="text-xs sm:text-sm text-sky-200 font-medium mt-1">
                {doctorUser?.specialization || 'General Medicine'} • {doctorUser?.facility || 'Ananthapur Area Govt Hospital & CHC'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRole('PATIENT');
                setCurrentPage('auth');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Switch to Patient View</span>
            </button>
          </div>
        </div>

        {/* Doctor Dashboard Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-sky-200 font-bold uppercase tracking-wider block">Pending Requests</span>
            <span className="text-2xl font-black text-white">{pendingRequests.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-sky-200 font-bold uppercase tracking-wider block">Active Consults</span>
            <span className="text-2xl font-black text-sky-300">{acceptedRequests.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-sky-200 font-bold uppercase tracking-wider block">Urgent Alerts</span>
            <span className="text-2xl font-black text-rose-400">{emergencyRequests.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-sky-200 font-bold uppercase tracking-wider block">Scheduled Follow-ups</span>
            <span className="text-2xl font-black text-emerald-300">{followUps.length}</span>
          </div>

        </div>

      </div>

      {/* Main Tab Navigation */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <button
          onClick={() => { setActiveTab('REQUESTS'); setSelectedPatientRequest(null); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-2 ${
            activeTab === 'REQUESTS' && !selectedPatientRequest
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patient Requests Inbox ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('ACTIVE'); setSelectedPatientRequest(null); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-2 ${
            activeTab === 'ACTIVE'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Active Consultations ({acceptedRequests.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('FOLLOWUPS'); setSelectedPatientRequest(null); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-2 ${
            activeTab === 'FOLLOWUPS'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Patient Follow-ups ({followUps.length})</span>
        </button>
      </div>

      {/* PATIENT DETAIL VIEW (PATIENT HEALTHCARE DASHBOARD FOR DOCTOR) */}
      {selectedPatientRequest ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Back button */}
          <button
            onClick={() => setSelectedPatientRequest(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600" />
            <span>← Back to Patient Requests Queue</span>
          </button>

          {/* Patient Card Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xl border border-sky-200">
                  {selectedPatientRequest.patientName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedPatientRequest.patientName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedPatientRequest.patientAge} Yrs • {selectedPatientRequest.patientGender}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Location: {selectedPatientRequest.location} • Preferred Lang: <strong className="text-sky-700 uppercase">{selectedPatientRequest.language}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAcceptAndConsult(selectedPatientRequest)}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow transition-all flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Video Consultation</span>
                </button>

                <button
                  onClick={() => setShowFollowUpModal(true)}
                  className="px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Follow-up</span>
                </button>
              </div>
            </div>

            {/* Request & Health Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Box: Current Health Concern */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Patient Submitted Health Concern
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    selectedPatientRequest.urgency === 'Emergency' ? 'bg-rose-100 text-rose-800' :
                    selectedPatientRequest.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {selectedPatientRequest.urgency} Priority
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-800 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                  "{selectedPatientRequest.description}"
                </p>

                <div className="text-xs text-slate-500 font-semibold space-y-1">
                  <p>• Requested Consultation Type: <strong className="text-slate-800">{selectedPatientRequest.consultationType}</strong></p>
                  <p>• Submitted Timestamp: <strong className="text-slate-800">{selectedPatientRequest.createdAt}</strong></p>
                </div>
              </div>

              {/* Right Box: Available Doctor Summary & AI Translation */}
              <div className="p-5 bg-sky-50/60 rounded-2xl border border-sky-200 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Structured Summary for Doctor
                </span>

                <div className="bg-white p-3.5 rounded-xl border border-sky-200 text-xs space-y-2 font-medium text-slate-800">
                  <p><strong>Primary Language:</strong> {selectedPatientRequest.language === 'te' ? 'Telugu (తెలుగు)' : selectedPatientRequest.language.toUpperCase()}</p>
                  <p><strong>Key Complaints:</strong> Fever, chills, fatigue reported by patient.</p>
                  <p><strong>AI Communicator Assistance:</strong> Bi-directional Telugu ↔ English live translation available during call.</p>
                </div>

                <div className="p-2.5 bg-sky-100/70 rounded-xl text-[11px] font-bold text-sky-900 text-center">
                  Doctor verification — Demo Data
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* PATIENT REQUESTS QUEUE */
        <div className="space-y-4">
          
          {activeTab === 'REQUESTS' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Patient Requests Queue
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Review incoming requests from rural patients and ASHA health workers
                  </p>
                </div>

                {/* Urgency Filter */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <span className="text-slate-500 pl-2">Filter:</span>
                  {(['ALL', 'Emergency', 'High', 'Medium'] as const).map((urgency) => (
                    <button
                      key={urgency}
                      onClick={() => setFilterUrgency(urgency)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                        filterUrgency === urgency ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                      }`}
                    >
                      {urgency}
                    </button>
                  ))}
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="text-center py-12 space-y-2 text-slate-400">
                  <Users className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm font-bold">No pending patient requests found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                            {req.patientName[0]}
                          </div>
                          <div>
                            <span className="text-base font-extrabold text-slate-900">{req.patientName}</span>
                            <span className="text-xs text-slate-500 font-semibold ml-2">
                              ({req.patientAge}M, {req.location})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            req.urgency === 'Emergency' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                            req.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                          }`}>
                            {req.urgency}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">{req.createdAt}</span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                        "{req.description}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
                          <span>Language: <strong className="text-sky-700 uppercase">{req.language}</strong></span>
                          <span>•</span>
                          <span>Type: <strong className="text-slate-800">{req.consultationType}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPatientRequest(req)}
                            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs transition-colors"
                          >
                            View Patient Details
                          </button>

                          <button
                            onClick={() => handleAcceptAndConsult(req)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow transition-colors flex items-center gap-1.5"
                          >
                            <Video className="w-4 h-4" />
                            <span>Accept & Video Call</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {activeTab === 'ACTIVE' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Active Consultations</h2>
              <div className="p-5 rounded-2xl border border-sky-200 bg-sky-50 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-base font-extrabold text-slate-900">Ravi Kumar (42M)</span>
                  <p className="text-xs text-sky-800 font-semibold mt-0.5">
                    Accepted Video Consultation • Fever & Body Chills
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('consultation')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Call Room</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'FOLLOWUPS' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Scheduled Patient Follow-ups</h2>
              <div className="grid grid-cols-1 gap-3">
                {followUps.map(fup => (
                  <div key={fup.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900">{fup.patientName}</span>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Date: {fup.date} ({fup.time}) • {fup.notes}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full">
                      {fup.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Follow Up Modal */}
      {showFollowUpModal && selectedPatientRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateFollowUpSubmit} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900">
              Schedule Follow-up for {selectedPatientRequest.patientName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions / Notes</label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="e.g. Review blood pressure and temperature..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFollowUpModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow"
              >
                Save & Notify Patient
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
