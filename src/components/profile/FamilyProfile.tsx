import React, { useState } from 'react';
import { PageView, FamilyMember } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_FAMILY_MEMBERS } from '../../data/mockData';
import { 
  Users, 
  UserPlus, 
  Heart, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  X,
  Plus
} from 'lucide-react';

interface FamilyProfileProps {
  setCurrentPage: (page: PageView) => void;
}

export const FamilyProfile: React.FC<FamilyProfileProps> = ({ setCurrentPage }) => {
  const { t, language } = useLanguage();
  const [members, setMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<FamilyMember>(MOCK_FAMILY_MEMBERS[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Add Member Form State
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState<'Self' | 'Mother' | 'Father' | 'Spouse' | 'Child' | 'Grandparent'>('Mother');
  const [newAge, setNewAge] = useState<number>(60);
  const [newGender, setNewGender] = useState('Female');
  const [newBloodGroup, setNewBloodGroup] = useState('O+ positive');
  const [newCondition, setNewCondition] = useState('');

  const isTe = language === 'te';

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMem: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newName.trim(),
      relation: newRelation,
      age: Number(newAge),
      gender: newGender,
      bloodGroup: newBloodGroup,
      chronicConditions: newCondition.trim() ? [newCondition.trim()] : ['None'],
      lastConsultation: 'Not recorded yet',
      pendingReminders: ['Schedule initial wellness check at PHC']
    };

    setMembers(prev => [...prev, newMem]);
    setSelectedMember(newMem);
    setIsAddModalOpen(false);

    // Reset Form
    setNewName('');
    setNewCondition('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> Rural Household Health Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('familyTitle')}
          </h1>
          <p className="text-emerald-100 text-sm font-medium">
            {t('familySubtitle')}
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 text-emerald-600" />
          <span>{t('addMember')}</span>
        </button>
      </div>

      {/* Family Member Pill Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {members.map((m) => {
          const isSelected = selectedMember.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMember(m)}
              className={`p-4 rounded-2xl border text-left shrink-0 transition-all flex items-center gap-3 min-w-[180px] ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {m.relation.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-extrabold">{m.name}</div>
                <div className={`text-[11px] font-medium ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {m.relation} • {m.age} yrs
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Member Detail View */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 border-slate-100 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {selectedMember.relation} Profile
            </span>
            <h2 className="text-2xl font-black text-slate-900">{selectedMember.name}</h2>
            <p className="text-xs text-slate-500 font-medium">
              Blood Group: <span className="text-slate-900 font-bold">{selectedMember.bloodGroup}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
            <span className="text-slate-400 font-medium block">Chronic Conditions:</span>
            <div className="flex flex-wrap gap-1">
              {selectedMember.chronicConditions.map((c, i) => (
                <span key={i} className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reminders & Recent Consultations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pending Reminders */}
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-3">
            <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pending Health Reminders</span>
            </h3>

            <div className="space-y-2">
              {selectedMember.pendingReminders.map((r, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-amber-100 text-xs font-semibold text-amber-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Past Consultation Summary */}
          <div className="bg-sky-50/80 p-5 rounded-2xl border border-sky-200 space-y-3">
            <h3 className="text-sm font-extrabold text-sky-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Last Consultation Record</span>
            </h3>

            <div className="p-3 bg-white rounded-xl border border-sky-100 text-xs space-y-1">
              <div className="text-slate-500 font-medium">Date & Facility:</div>
              <div className="font-bold text-slate-900">{selectedMember.lastConsultation}</div>
              <div className="text-emerald-700 font-semibold pt-1">✓ Structured Doctor Note saved in Health Vault</div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Add Family Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Add Family Member</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Lakshmi Devi"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Relation</label>
                  <select
                    value={newRelation}
                    onChange={(e: any) => setNewRelation(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Grandparent">Grandparent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    min="1"
                    max="120"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="O+ positive">O+ Positive</option>
                    <option value="A+ positive">A+ Positive</option>
                    <option value="B+ positive">B+ Positive</option>
                    <option value="AB+ positive">AB+ Positive</option>
                    <option value="O- negative">O- Negative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Chronic Health Condition (Optional)</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Hypertension, Diabetes, Asthma"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow"
                >
                  Save Member Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
