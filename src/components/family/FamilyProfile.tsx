import React, { useState } from 'react';
import { useHealthcare } from '../../context/HealthcareContext';
import { PageView, FamilyMember } from '../../types';
import { Users, Plus, Heart, Calendar, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FamilyProfileProps {
  setCurrentPage: (page: PageView) => void;
}

export const FamilyProfile: React.FC<FamilyProfileProps> = ({ setCurrentPage }) => {
  const { familyMembers, addFamilyMember } = useHealthcare();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState<'Mother' | 'Father' | 'Spouse' | 'Child' | 'Grandparent'>('Mother');
  const [age, setAge] = useState(68);
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [chronic, setChronic] = useState('Hypertension, Diabetes');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFamilyMember({
      name: name.trim(),
      relation,
      age: Number(age),
      gender,
      bloodGroup,
      chronicConditions: chronic.split(',').map(s => s.trim()),
      pendingReminders: ['Routine checkup due']
    });

    setShowAddModal(false);
    setName('');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
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
              Family Health Profile
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Manage health records and reminders for your loved ones
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
                  {member.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{member.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {member.relation}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {member.age} Yrs • {member.gender} • Blood Group: <strong className="text-emerald-700">{member.bloodGroup}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Chronic conditions */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                User-Provided Health Notes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.chronicConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>

            {/* Pending Reminders */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Active Health Reminders:
              </span>
              {member.pendingReminders.map((rem, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{rem}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900">Add Family Member</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lakshmi Devi"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relation</label>
                  <select
                    value={relation}
                    onChange={(e: any) => setRelation(e.target.value)}
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
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min="1"
                    max="120"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder="O+"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chronic Conditions (comma separated)</label>
                <input
                  type="text"
                  value={chronic}
                  onChange={(e) => setChronic(e.target.value)}
                  placeholder="Hypertension, Diabetes"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow"
              >
                Save Family Member
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
