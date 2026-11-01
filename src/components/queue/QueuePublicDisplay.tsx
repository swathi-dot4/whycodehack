import React, { useEffect, useState } from 'react';
import { useFairQueue } from '../../context/FairQueueContext';
import { ArrowLeft, Volume2, Monitor } from 'lucide-react';

interface Props { onBack: () => void; }

export const QueuePublicDisplay: React.FC<Props> = ({ onBack }) => {
  const { queueStatus, selectedDepartment, refreshStatus } = useFairQueue();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    refreshStatus();
    const qInterval = setInterval(refreshStatus, 10000);
    const tInterval = setInterval(() => setTime(new Date()), 1000);
    return () => { clearInterval(qInterval); clearInterval(tInterval); };
  }, []);

  const announceServing = () => {
    if (!queueStatus?.currently_serving || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(
      `Attention please. Token number ${queueStatus.currently_serving} please proceed to the doctor.`
    );
    u.lang = 'en-IN'; u.rate = 0.8; u.volume = 1;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Main display */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white min-h-[500px] flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-teal-300 text-sm font-bold uppercase tracking-widest">Smart FairQueue</p>
            <p className="text-white font-extrabold text-lg">{selectedDepartment?.name || 'All Departments'}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-white tabular-nums">{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-teal-300 text-sm">{time.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short' })}</p>
          </div>
        </div>

        {/* Currently serving */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-teal-300 text-sm font-bold uppercase tracking-widest mb-2">Now Serving</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl px-12 py-8 border-2 border-white/20 text-center mb-6">
            {queueStatus?.currently_serving ? (
              <p className="text-[80px] sm:text-[120px] font-black text-white leading-none tracking-tight">
                {queueStatus.currently_serving}
              </p>
            ) : (
              <p className="text-4xl font-black text-white/50">—</p>
            )}
          </div>

          <button
            onClick={announceServing}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-bold text-sm transition-colors mb-8"
          >
            <Volume2 className="w-4 h-4" /> Announce Token
          </button>

          {/* Next tokens */}
          {queueStatus?.next_tokens && queueStatus.next_tokens.length > 0 && (
            <div className="text-center">
              <p className="text-teal-300 text-sm font-bold uppercase tracking-widest mb-3">Next Tokens</p>
              <div className="flex gap-4 justify-center flex-wrap">
                {queueStatus.next_tokens.map((t, i) => (
                  <div key={t} className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-xl ${i === 0 ? 'bg-teal-400 text-teal-900' : 'bg-white/10 text-white'}`}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-4xl font-black text-amber-300">{queueStatus?.total_waiting ?? '—'}</p>
            <p className="text-teal-300 text-xs font-bold uppercase mt-1">Waiting</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-green-300">{queueStatus?.total_completed ?? '—'}</p>
            <p className="text-teal-300 text-xs font-bold uppercase mt-1">Completed</p>
          </div>
          <div className="col-span-2 sm:col-span-1 text-center">
            <p className="text-white/60 text-xs font-semibold">Updates every 10 seconds</p>
            <p className="text-teal-300 text-xs mt-1 font-bold">No patient names displayed</p>
          </div>
        </div>

        {/* Fairness note */}
        <p className="text-center text-teal-300/70 text-xs mt-4 italic">
          Every patient deserves fair access to healthcare. Your queue position is transparent and traceable.
        </p>
      </div>
    </div>
  );
};
