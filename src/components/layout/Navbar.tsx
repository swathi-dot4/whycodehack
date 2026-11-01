import React, { useState } from 'react';
import { PageView, Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { 
  Heart, 
  Globe, 
  Bell, 
  LogOut, 
  User, 
  Stethoscope, 
  ArrowLeft, 
  Menu, 
  X,
  Bot,
  Scan,
  PhoneCall,
  Building2,
  WifiOff,
  Users,
  Calendar,
  Send,
  Video,
  Ticket
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { language, setLanguage } = useLanguage();
  const { role, setRole, activeUser, isAuthenticated, isGuest, logout } = useAuth();
  const { notifications } = useHealthcare();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(
    n => (n.role === role || n.role === 'ALL') && !n.read
  ).length;

  const isSecondaryPage = currentPage !== 'dashboard' && currentPage !== 'doctor_dashboard' && currentPage !== 'auth' && currentPage !== 'splash';

  const handleLogout = () => {
    logout();
    setCurrentPage('auth');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Branding & Back Button */}
            <div className="flex items-center gap-3">
              {isSecondaryPage && (
                <button
                  onClick={() => setCurrentPage(role === 'DOCTOR' ? 'doctor_dashboard' : 'dashboard')}
                  className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 font-bold text-xs"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}

              <div 
                onClick={() => setCurrentPage(role === 'DOCTOR' ? 'doctor_dashboard' : 'dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${role === 'PATIENT' ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500' : 'bg-gradient-to-tr from-sky-600 to-sky-500'} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  {role === 'PATIENT' ? (
                    <Heart className="w-6 h-6 fill-white" />
                  ) : (
                    <Stethoscope className="w-6 h-6 text-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                      CareBridge AI
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      role === 'PATIENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {role}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-700 font-bold hidden sm:block">
                    Healthcare guidance in your language.
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
              {role === 'PATIENT' ? (
                <>
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'dashboard' ? 'bg-emerald-50 text-emerald-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setCurrentPage('guide')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'guide' ? 'bg-emerald-50 text-emerald-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    AI Guide
                  </button>
                  <button
                    onClick={() => setCurrentPage('requests')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'requests' ? 'bg-emerald-50 text-emerald-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    Consult Doctor
                  </button>
                  <button
                    onClick={() => setCurrentPage('medicine')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'medicine' ? 'bg-emerald-50 text-emerald-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    Medicine Scan
                  </button>
                  <button
                    onClick={() => setCurrentPage('facilities')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'facilities' ? 'bg-emerald-50 text-emerald-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    Find Care
                  </button>
                  <button
                    onClick={() => setCurrentPage('queue')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${currentPage === 'queue' ? 'bg-teal-50 text-teal-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    FairQueue
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentPage('doctor_dashboard')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'doctor_dashboard' ? 'bg-sky-50 text-sky-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    Patient Inbox
                  </button>
                  <button
                    onClick={() => setCurrentPage('consultation')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'consultation' ? 'bg-sky-50 text-sky-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    Video Consultation
                  </button>
                  <button
                    onClick={() => setCurrentPage('followups')}
                    className={`px-3 py-2 rounded-xl transition-colors ${currentPage === 'followups' ? 'bg-sky-50 text-sky-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    Follow-ups
                  </button>
                  <button
                    onClick={() => setCurrentPage('queue')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${currentPage === 'queue' ? 'bg-teal-50 text-teal-800 font-black' : 'hover:bg-slate-100'}`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    FairQueue
                  </button>
                </>
              )}
            </nav>

            {/* Right: Controls & Profile */}
            <div className="flex items-center gap-2">
              
              {/* Language selector */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold"
                >
                  <option value="te">🇮🇳 TE</option>
                  <option value="en">🇬🇧 EN</option>
                  <option value="hi">🇮🇳 HI</option>
                  <option value="as">🇮🇳 AS</option>
                </select>
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Profile / Logout */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 animate-fade-in">
            <div className="pb-2 border-b border-slate-100 text-xs font-bold">
              <span>Role: <strong className="text-emerald-700">{role}</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
              {role === 'PATIENT' ? (
                <>
                  <button onClick={() => { setCurrentPage('dashboard'); setIsMobileMenuOpen(false); }} className="p-3 bg-slate-50 rounded-xl text-left">🏠 Home</button>
                  <button onClick={() => { setCurrentPage('guide'); setIsMobileMenuOpen(false); }} className="p-3 bg-slate-50 rounded-xl text-left">🤖 AI Guide</button>
                  <button onClick={() => { setCurrentPage('requests'); setIsMobileMenuOpen(false); }} className="p-3 bg-slate-50 rounded-xl text-left">🩺 Request Doctor</button>
                  <button onClick={() => { setCurrentPage('medicine'); setIsMobileMenuOpen(false); }} className="p-3 bg-slate-50 rounded-xl text-left">💊 Scan Medicine</button>
                  <button onClick={() => { setCurrentPage('facilities'); setIsMobileMenuOpen(false); }} className="p-3 bg-slate-50 rounded-xl text-left">🏥 Find Care</button>
                  <button onClick={() => { setCurrentPage('consultation'); setIsMobileMenuOpen(false); }} className="p-3 bg-slate-50 rounded-xl text-left">📹 Video Consult</button>
                  <button onClick={() => { setCurrentPage('queue'); setIsMobileMenuOpen(false); }} className="p-3 bg-teal-50 text-teal-800 rounded-xl text-left font-extrabold">🎫 Smart FairQueue</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setCurrentPage('doctor_dashboard'); setIsMobileMenuOpen(false); }} className="p-3 bg-sky-50 rounded-xl text-left text-sky-900">🩺 Doctor Dashboard</button>
                  <button onClick={() => { setCurrentPage('consultation'); setIsMobileMenuOpen(false); }} className="p-3 bg-sky-50 rounded-xl text-left text-sky-900">📹 Video Call Room</button>
                  <button onClick={() => { setCurrentPage('followups'); setIsMobileMenuOpen(false); }} className="p-3 bg-sky-50 rounded-xl text-left text-sky-900">📅 Follow-ups</button>
                  <button onClick={() => { setCurrentPage('queue'); setIsMobileMenuOpen(false); }} className="p-3 bg-teal-50 text-teal-800 rounded-xl text-left font-extrabold">🎫 Smart FairQueue</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        setCurrentPage={setCurrentPage} 
      />
    </>
  );
};
