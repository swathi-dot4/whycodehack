import React from 'react';
import { Heart, ShieldCheck, PhoneCall, Building2 } from 'lucide-react';
import { PageView } from '../../types';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              <span>CareBridge AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering rural and underserved citizens to understand health needs, scan medicine labels, and communicate clearly in local languages.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              <ShieldCheck className="w-4 h-4" /> AI Guides • Doctors Decide
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Patient Care Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('guide')} className="hover:text-emerald-400 transition-colors">
                  🤖 AI Healthcare Guide
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('doctor')} className="hover:text-emerald-400 transition-colors">
                  🩺 Explain to Doctor ("Explain My Problem")
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('medicine')} className="hover:text-emerald-400 transition-colors">
                  💊 Medicine Scanner & Label Info
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('facilities')} className="hover:text-emerald-400 transition-colors">
                  🏥 Primary Health Centre Finder
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Healthcare Workers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('worker')} className="hover:text-emerald-400 transition-colors">
                  👩‍⚕️ ASHA & PHC Worker Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('calls')} className="hover:text-emerald-400 transition-colors">
                  📞 Local-Language Calling Kiosk
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('offline')} className="hover:text-emerald-400 transition-colors">
                  📡 Low-Connectivity Sync Queue
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('profile')} className="hover:text-emerald-400 transition-colors">
                  👨‍👩‍👧 Family Health Records
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Emergency Helplines</h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs text-white font-bold">
                <span>Ambulance Service:</span>
                <span className="text-amber-400 text-sm font-black">108</span>
              </div>
              <div className="flex items-center justify-between text-xs text-white font-bold">
                <span>Health Advice Helpline:</span>
                <span className="text-sky-400 text-sm font-black">104</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Supports Telugu, Hindi, and English for immediate emergency assistance.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CareBridge AI Healthcare Access Platform. Designed for Social Impact.</p>
          <p className="mt-2 sm:mt-0 font-medium text-slate-400">Core Principle: AI as a Guide, Not a Judge.</p>
        </div>
      </div>
    </footer>
  );
};
