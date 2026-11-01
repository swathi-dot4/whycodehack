import React from 'react';
import { useHealthcare } from '../../context/HealthcareContext';
import { PageView } from '../../types';
import { Calendar, Clock, Bell, CheckCircle2, ArrowLeft, ShieldCheck, Stethoscope } from 'lucide-react';

interface FollowUpListProps {
  setCurrentPage: (page: PageView) => void;
}

export const FollowUpList: React.FC<FollowUpListProps> = ({ setCurrentPage }) => {
  const { followUps, toggleFollowUpReminder } = useHealthcare();

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
              Healthcare Follow-ups & Reminders
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Track upcoming doctor instructions and schedule reviews
            </p>
          </div>
        </div>
      </div>

      {/* Follow ups list */}
      <div className="grid grid-cols-1 gap-4">
        {followUps.map((fup) => (
          <div
            key={fup.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{fup.doctorName}</h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Scheduled Date: <strong className="text-sky-700">{fup.date}</strong> {fup.time && `(${fup.time})`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  fup.status === 'UPCOMING' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {fup.status}
                </span>

                <button
                  onClick={() => toggleFollowUpReminder(fup.id)}
                  className={`p-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                    fup.reminderSet
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <Bell className={`w-4 h-4 ${fup.reminderSet ? 'fill-emerald-600' : ''}`} />
                  <span>{fup.reminderSet ? 'Reminder On' : 'Set Reminder'}</span>
                </button>
              </div>
            </div>

            {/* Notes & Instructions */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
                Doctor Instructions:
              </span>
              <p className="text-slate-800 font-semibold">
                "{fup.instructionsEn}"
              </p>
              {fup.instructionsTe && (
                <p className="text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-1">
                  తెలుగు సూచన: "{fup.instructionsTe}"
                </p>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
