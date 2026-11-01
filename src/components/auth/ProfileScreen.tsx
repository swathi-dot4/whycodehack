import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PageView } from '../../types';
import { MOCK_ACTIVITIES, MOCK_FAMILY_MEMBERS } from '../../data/mockData';
import { 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldAlert, 
  Edit3, 
  LogOut, 
  Clock, 
  FileText, 
  Pill, 
  Bot, 
  Users,
  Sparkles,
  X,
  CheckCircle2
} from 'lucide-react';

interface ProfileScreenProps {
  setCurrentPage: (page: PageView) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ setCurrentPage }) => {
  const { patientUser, isGuest, updatePatientProfile, logout } = useAuth();
  const user = patientUser;
  const updateProfile = updatePatientProfile;
  const { t, language, setLanguage } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);

  // Edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [editAge, setEditAge] = useState(user?.age || 42);
  const [editGender, setEditGender] = useState(user?.gender || 'Male');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editEmergency, setEditEmergency] = useState(user?.emergencyContact || '');

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      age: Number(editAge),
      gender: editGender,
      location: editLocation,
      emergencyContact: editEmergency
    });
    setIsEditing(false);
  };

  if (isGuest || !user) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-8 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Guest Mode Active</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
            You are currently using CareBridge AI in Guest Mode. You can use all core healthcare features. Create an account to save personal health records and doctor summaries.
          </p>

          <button
            onClick={logout}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow"
          >
            Login / Register Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl font-black shadow-inner border border-white/30">
            {user.name.charAt(0)}
          </div>
          <div>
            <span className="text-xs text-emerald-200 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              Registered Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {user.name}
            </h1>
            <p className="text-xs text-emerald-100 font-medium">
              {user.gender} • {user.age} Years • {user.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl border border-white/30 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* User Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact & Personal Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Personal & Emergency Details</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Mobile Number:</span>
              <span className="font-bold text-slate-900">{user.mobile}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Preferred Language:</span>
              <span className="font-bold text-slate-900">
                {user.preferredLanguage === 'te' ? '🇮🇳 Telugu (తెలుగు)' : user.preferredLanguage === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Village / Location:</span>
              <span className="font-bold text-slate-900">{user.location}</span>
            </div>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex justify-between items-center text-rose-950">
              <span className="font-medium">Emergency Contact:</span>
              <span className="font-bold">{user.emergencyContact}</span>
            </div>
          </div>
        </div>

        {/* Household Family Link Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Family Members ({MOCK_FAMILY_MEMBERS.length})</span>
              </h3>

              <button
                onClick={() => setCurrentPage('profile')}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Manage Family →
              </button>
            </div>

            <div className="space-y-2">
              {MOCK_FAMILY_MEMBERS.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{m.name}</span>
                    <span className="text-[11px] text-slate-500">{m.relation} • {m.age} yrs</span>
                  </div>
                  <span className="text-[11px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                    {m.bloodGroup}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MY HEALTHCARE ACTIVITY SECTION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>My Healthcare Activity History</span>
        </h3>

        <div className="space-y-3">
          {MOCK_ACTIVITIES.map((act) => (
            <div key={act.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
                {act.type === 'AI_GUIDANCE' ? <Bot className="w-5 h-5 text-emerald-600" /> :
                 act.type === 'MEDICINE_SCAN' ? <Pill className="w-5 h-5 text-amber-600" /> :
                 <Phone className="w-5 h-5 text-sky-600" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{act.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <span>Edit Profile</span>
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Village / Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all"
                >
                  Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
