import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  X, 
  MapPin, 
  UserCheck, 
  Building, 
  CheckCircle,
  Clock,
  Activity,
  ArrowRight
} from 'lucide-react';

export const EmergencyHelpModal: React.FC = () => {
  const { activeUser, patientUser } = useAuth();
  const { isEmergencyModalOpen, setEmergencyModalOpen, triggerEmergencyAlert } = useHealthcare();
  const [alertStage, setAlertStage] = useState<'IDLE' | 'ALERT_SENT' | 'REQUEST_RECEIVED' | 'ASSISTANCE_IN_PROGRESS'>('IDLE');

  if (!isEmergencyModalOpen) return null;

  const handleSendSOS = () => {
    triggerEmergencyAlert(
      activeUser?.name || 'Ravi Kumar',
      activeUser?.location || 'Ananthapur Rural'
    );
    setAlertStage('ALERT_SENT');

    // Simulate status progression: Alert Sent -> Request Received -> Assistance in Progress
    setTimeout(() => {
      setAlertStage('REQUEST_RECEIVED');
    }, 2000);

    setTimeout(() => {
      setAlertStage('ASSISTANCE_IN_PROGRESS');
    }, 4500);
  };

  const handleClose = () => {
    setEmergencyModalOpen(false);
    setAlertStage('IDLE');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      
      {/* Modal Box */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-rose-500/30 space-y-6 animate-fade-in relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30 animate-pulse">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Emergency Medical Assistance
          </h2>

          <p className="text-xs text-rose-700 font-extrabold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full inline-block">
            Immediate Care Options • Demo / Simulated
          </p>
        </div>

        {/* Emergency Actions List */}
        {alertStage === 'IDLE' ? (
          <div className="space-y-3">
            
            {/* Action 1: Call 108 Emergency */}
            <a
              href="tel:108"
              className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    Call 108 Govt Ambulance (Demo Call)
                  </span>
                  <span className="text-xs text-rose-700 font-semibold">
                    Free 24/7 Emergency Ambulance Service
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-black group-hover:scale-105 transition-transform">
                Call 108
              </span>
            </a>

            {/* Action 2: Contact Emergency Contact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    Contact Emergency Contact
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {patientUser?.emergencyContact || '+91 99887 11223 (ASHA Lakshmi)'}
                  </span>
                </div>
              </div>
              <a
                href={`tel:${patientUser?.emergencyContact || '+919988711223'}`}
                className="px-3 py-1 rounded-xl bg-sky-600 text-white text-xs font-black hover:bg-sky-700"
              >
                Call
              </a>
            </div>

            {/* Action 3: Trigger SOS Alert to Doctor */}
            <button
              onClick={handleSendSOS}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-extrabold text-xs shadow-lg hover:from-rose-700 hover:to-rose-800 transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Send Emergency Alert to Doctor & ASHA Worker</span>
            </button>

          </div>
        ) : (
          /* STATUS FLOW: Alert Sent -> Request Received -> Assistance in Progress */
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-5 animate-fade-in">
            
            {/* Visual Flow Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs font-black">
              <span className={`px-3 py-1.5 rounded-xl transition-all ${
                alertStage === 'ALERT_SENT' ? 'bg-rose-600 text-white shadow' : 'bg-slate-200 text-slate-600'
              }`}>
                1. Alert Sent
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

              <span className={`px-3 py-1.5 rounded-xl transition-all ${
                alertStage === 'REQUEST_RECEIVED' ? 'bg-amber-600 text-white shadow' : 
                alertStage === 'ASSISTANCE_IN_PROGRESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                2. Request Received
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

              <span className={`px-3 py-1.5 rounded-xl transition-all ${
                alertStage === 'ASSISTANCE_IN_PROGRESS' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-600'
              }`}>
                3. Assistance in Progress
              </span>
            </div>

            {/* Active Stage Details */}
            {alertStage === 'ALERT_SENT' && (
              <div className="space-y-2 py-4 animate-fade-in">
                <Activity className="w-10 h-10 text-rose-600 mx-auto animate-spin" />
                <h3 className="text-base font-black text-slate-900">Alert Dispatched to Healthcare Network...</h3>
                <p className="text-xs text-slate-500 font-semibold">Transmitting location ({activeUser?.location || 'Ananthapur Rural'})...</p>
              </div>
            )}

            {alertStage === 'REQUEST_RECEIVED' && (
              <div className="space-y-2 py-4 animate-fade-in">
                <Clock className="w-10 h-10 text-amber-600 mx-auto animate-bounce" />
                <h3 className="text-base font-black text-slate-900">Request Acknowledged by PHC Doctor</h3>
                <p className="text-xs text-slate-600 font-semibold">Dr. Venkat Rao & ASHA Lakshmi received emergency notification.</p>
              </div>
            )}

            {alertStage === 'ASSISTANCE_IN_PROGRESS' && (
              <div className="space-y-2 py-4 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Assistance in Progress!</h3>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  ASHA worker Lakshmi has been dispatched. 108 Emergency Ambulance service pre-notified.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                Demo / Simulated Flow
              </span>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow"
            >
              Close Alert Dialog
            </button>

          </div>
        )}

        {/* Safety Warning */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-bold text-center leading-relaxed">
          ⚠️ CareBridge AI does not replace official emergency services. In case of life-threatening situations, dial 108 or visit nearest hospital immediately. AI does not make medical emergency decisions.
        </div>

      </div>

    </div>
  );
};
