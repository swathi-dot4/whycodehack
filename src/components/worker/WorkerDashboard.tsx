import React, { useState } from 'react';
import { PageView, WorkerPatientRecord } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_WORKER_PATIENTS } from '../../data/mockData';
import { 
  UserCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  FileText, 
  Sparkles, 
  Search,
  ChevronRight,
  ShieldCheck,
  Building2,
  Volume2,
  PlusCircle,
  X,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface WorkerDashboardProps {
  setCurrentPage: (page: PageView) => void;
  onInitiateCall: (contactName: string, role: string, phone: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ setCurrentPage, onInitiateCall }) => {
  const { t, language } = useLanguage();
  const [patients, setPatients] = useState<WorkerPatientRecord[]>(MOCK_WORKER_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<WorkerPatientRecord | null>(MOCK_WORKER_PATIENTS[0]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // New Patient Form State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState(35);
  const [newVillage, setNewVillage] = useState('Ananthapur Village');
  const [newConcern, setNewConcern] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Normal'>('Medium');

  const isTe = language === 'te';

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
    if (selectedPatient && selectedPatient.id === id) {
      setSelectedPatient(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleCreatePatientRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newConcern.trim()) return;

    const newRecord: WorkerPatientRecord = {
      id: `rec-${Date.now()}`,
      patientName: newPatientName.trim(),
      age: Number(newPatientAge),
      village: newVillage,
      primaryLanguage: language,
      chiefConcern: newConcern.trim(),
      status: 'Pending Review',
      priority: newPriority,
      timestamp: 'Just now',
      summaryEn: `Patient reports: ${newConcern.trim()}`,
      summaryTe: `రోగి తెలిపిన వివరణ: ${newConcern.trim()}`,
      phone: '+91 98480 ' + Math.floor(10000 + Math.random() * 90000)
    };

    setPatients(prev => [newRecord, ...prev]);
    setSelectedPatient(newRecord);
    setIsAddPatientModalOpen(false);

    // Reset Form
    setNewPatientName('');
    setNewConcern('');
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.chiefConcern.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-black"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> ASHA Worker & PHC Doctor Portal
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('workerTitle')}
          </h1>
          <p className="text-emerald-100 text-sm font-medium">
            {t('workerSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsAddPatientModalOpen(true)}
          className="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>New Patient Triage</span>
        </button>
      </div>

      {/* 5 Status Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500 font-bold uppercase">Pending Requests</div>
          <div className="text-2xl font-black text-emerald-600">
            {patients.filter(p => p.status === 'Pending Review').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500 font-bold uppercase">High Priority</div>
          <div className="text-2xl font-black text-rose-600">
            {patients.filter(p => p.priority === 'High').length} Urgent
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500 font-bold uppercase">Reviewed</div>
          <div className="text-2xl font-black text-sky-600">
            {patients.filter(p => p.status === 'Reviewed').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] text-slate-500 font-bold uppercase">Follow-ups</div>
          <div className="text-2xl font-black text-amber-600">
            {patients.filter(p => p.status === 'Follow-up Scheduled').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-slate-500 font-bold uppercase">Total Patient Log</div>
          <div className="text-2xl font-black text-indigo-600">{patients.length} Total</div>
        </div>

      </div>

      {/* Main Grid: Patient List Table (Left) + Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Patient Requests Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between space-y-3">
          <div>
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base">Incoming Patient Triage Queue</h3>
                <span className="text-xs text-slate-500 font-medium">Select patient to view</span>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient, village or concern..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {filteredPatients.map((p) => {
                const isSelected = selectedPatient?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={`p-4 cursor-pointer transition-all flex items-center justify-between hover:bg-slate-50 ${
                      isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{p.patientName}</span>
                        <span className="text-xs text-slate-500">({p.age} yrs)</span>
                        {p.priority === 'High' && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded border border-rose-300">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 font-medium">{p.chiefConcern}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span>Village: {p.village}</span>
                        <span>•</span>
                        <span>{p.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        p.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-800' : 
                        p.status === 'Follow-up Scheduled' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Patient record encrypted & verified
            </span>
          </div>
        </div>

        {/* Selected Patient Detail Inspector */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedPatient ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header */}
              <div className="border-b pb-4 border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Record ID: {selectedPatient.id}</span>
                  <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedPatient.village}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedPatient.patientName}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Preferred Language: <span className="text-slate-900 font-bold">{selectedPatient.primaryLanguage === 'te' ? 'Telugu (తెలుగు)' : 'English'}</span>
                </p>
              </div>

              {/* Telugu Structured Voice Summary */}
              <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-emerald-900">
                  <span>🇮🇳 Telugu Patient Summary (తెలుగు సారాంశం)</span>
                  <button
                    onClick={() => speakText(selectedPatient.summaryTe, 'te')}
                    className="p-1 px-2 rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 text-[11px] font-bold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen Audio
                  </button>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                  "{selectedPatient.summaryTe}"
                </p>
              </div>

              {/* English Clinical Note */}
              <div className="bg-sky-50/90 p-4 rounded-2xl border border-sky-200 space-y-2">
                <div className="text-xs font-extrabold text-sky-900">
                  🩺 Pre-Formatted Clinical Note for Doctor
                </div>
                <p className="text-xs text-sky-950 leading-relaxed font-medium">
                  {selectedPatient.summaryEn}
                </p>
              </div>

              {/* Status Update & Actions */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Actions & Triage</div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'Reviewed')}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    Mark as Reviewed
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'Follow-up Scheduled')}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    Schedule Follow-up
                  </button>
                </div>

                <button
                  onClick={() => onInitiateCall(selectedPatient.patientName, "Patient", selectedPatient.phone)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call Patient ({selectedPatient.phone})</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select a patient from the triage list to inspect summary details.
            </div>
          )}
        </div>

      </div>

      {/* New Patient Triage Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>New Patient Request Entry</span>
              </h3>
              <button 
                onClick={() => setIsAddPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatientRecord} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Patient Name</label>
                <input
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Venkat Rao"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    min="1"
                    max="120"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Village / Sub-Center</label>
                <input
                  type="text"
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Chief Health Concern</label>
                <textarea
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                  placeholder="Describe patient concern in English or Telugu..."
                  required
                  className="w-full h-24 p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow"
                >
                  Create Patient Triage Entry
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
