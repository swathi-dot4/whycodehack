import React, { useState } from 'react';
import { PageView, Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAIContext } from '../../context/AIContextManager';
import { useOffline } from '../../context/OfflineContext';
import { 
  PlayCircle, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Bot, 
  Stethoscope, 
  Pill, 
  PhoneCall, 
  Building2, 
  WifiOff, 
  UserCheck,
  X
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentPage: (page: PageView) => void;
  onSelectPrompt: (promptText: string) => void;
  onInitiateCall: (contactName: string, role: string, phone: string) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  setCurrentPage,
  onSelectPrompt,
  onInitiateCall
}) => {
  const { setLanguage } = useLanguage();
  const { setAIContext } = useAIContext();
  const { setIsOffline, syncOfflineRequests } = useOffline();

  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const tourSteps = [
    {
      step: 1,
      title: "1. Select Telugu Language",
      description: "Set primary language to Telugu for rural patient accessibility.",
      icon: <Globe className="w-6 h-6 text-sky-500" />,
      actionLabel: "Execute Step 1 →",
      action: () => setLanguage('te')
    },
    {
      step: 2,
      title: "2. Open AI Healthcare Guide",
      description: "Navigate to conversational AI interface designed for non-diagnostic symptom structuring.",
      icon: <Bot className="w-6 h-6 text-emerald-500" />,
      actionLabel: "Open AI Guide →",
      action: () => {
        setAIContext('SYMPTOM_GUIDANCE');
        setCurrentPage('guide');
      }
    },
    {
      step: 3,
      title: "3. Speak/Type Telugu Health Concern",
      description: "Inject raw patient Telugu input: 'నాకు రెండు రోజుల నుండి జ్వరం ఉంది, రాత్రి ఎక్కువవుతోంది'",
      icon: <Bot className="w-6 h-6 text-emerald-500" />,
      actionLabel: "Inject Telugu Input →",
      action: () => {
        onSelectPrompt("నాకు రెండు రోజుల నుండి జ్వరం ఉంది, రాత్రి ఎక్కువవుతోంది");
        setCurrentPage('guide');
      }
    },
    {
      step: 4,
      title: "4. Review AI Structured Information",
      description: "Extracts Main Concern (Fever), Duration (2 days), and Pattern without diagnosing disease.",
      icon: <CheckCircle2 className="w-6 h-6 text-sky-500" />,
      actionLabel: "View Structuring →",
      action: () => setCurrentPage('guide')
    },
    {
      step: 5,
      title: "5. Switch Context to Doctor Communication",
      description: "Automatically change active AI Context badge to DOCTOR_COMMUNICATION.",
      icon: <Stethoscope className="w-6 h-6 text-indigo-500" />,
      actionLabel: "Switch Context →",
      action: () => setAIContext('DOCTOR_COMMUNICATION')
    },
    {
      step: 6,
      title: "6. Open 'Explain My Problem' Doctor Note",
      description: "Generate concise Telugu & English clinical note doctor can inspect.",
      icon: <Stethoscope className="w-6 h-6 text-indigo-500" />,
      actionLabel: "Open Explain My Problem →",
      action: () => setCurrentPage('doctor')
    },
    {
      step: 7,
      title: "7. Scan Sample Medicine Packaging",
      description: "Analyze Calpol 500mg strip with OCR mock to extract manufacturer & dosage form.",
      icon: <Pill className="w-6 h-6 text-amber-500" />,
      actionLabel: "Open Medicine Scanner →",
      action: () => {
        setAIContext('MEDICINE_SCAN');
        setCurrentPage('medicine');
      }
    },
    {
      step: 8,
      title: "8. Open Healthcare Call Kiosk",
      description: "Demonstrate one-touch Telugu ASHA worker call hotline.",
      icon: <PhoneCall className="w-6 h-6 text-emerald-500" />,
      actionLabel: "Open Call Kiosk →",
      action: () => {
        setAIContext('HEALTHCARE_CALL');
        setCurrentPage('calls');
      }
    },
    {
      step: 9,
      title: "9. Find Nearby Rural PHC",
      description: "Locate Ananthapur Rural Primary Health Centre (2.4 km away).",
      icon: <Building2 className="w-6 h-6 text-sky-500" />,
      actionLabel: "Open Facility Finder →",
      action: () => {
        setAIContext('FACILITY_SEARCH');
        setCurrentPage('facilities');
      }
    },
    {
      step: 10,
      title: "10. Simulate Offline Low Connectivity Mode",
      description: "Toggle network state to OFFLINE to demonstrate IndexedDB storage.",
      icon: <WifiOff className="w-6 h-6 text-rose-500" />,
      actionLabel: "Toggle Offline State →",
      action: () => {
        setIsOffline(true);
        setCurrentPage('offline');
      }
    },
    {
      step: 11,
      title: "11. Save Request Offline",
      description: "Record patient request in local offline queue with 'Saved Offline' badge.",
      icon: <WifiOff className="w-6 h-6 text-rose-500" />,
      actionLabel: "Inspect Queue →",
      action: () => setCurrentPage('offline')
    },
    {
      step: 12,
      title: "12. Toggle Online Connectivity Back",
      description: "Simulate internet reconnection event.",
      icon: <Globe className="w-6 h-6 text-emerald-500" />,
      actionLabel: "Reconnect Internet →",
      action: () => {
        setIsOffline(false);
        syncOfflineRequests();
      }
    },
    {
      step: 13,
      title: "13. Show Auto-Synchronization",
      description: "Display progress notification and 'All requests synchronized successfully' alert.",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      actionLabel: "View Sync Toast →",
      action: () => setCurrentPage('offline')
    },
    {
      step: 14,
      title: "14. Open Healthcare Worker Dashboard",
      description: "Switch to ASHA & PHC doctor triage portal.",
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      actionLabel: "Open Worker Portal →",
      action: () => setCurrentPage('worker')
    },
    {
      step: 15,
      title: "15. Review Patient Request & Complete Demo",
      description: "Review Ravi Kumar's Telugu summary and mark triage status as Reviewed.",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      actionLabel: "View Patient Record →",
      action: () => setCurrentPage('worker')
    }
  ];

  const current = tourSteps[step - 1];

  const handleNext = () => {
    current.action();
    if (step < tourSteps.length) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      tourSteps[step - 2].action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 border border-slate-200 relative animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <PlayCircle className="w-5 h-5 fill-white text-amber-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Interactive Demonstration Tour</h2>
              <p className="text-xs text-slate-500 font-medium">15-Step Presentation Workflow</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Step {step} of 15</span>
            <span className="text-emerald-600">{Math.round((step / 15) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300"
              style={{ width: `${(step / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
              {current.icon}
            </div>
            <h3 className="text-base font-extrabold text-slate-900">{current.title}</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {current.description}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
          >
            <span>{current.actionLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
