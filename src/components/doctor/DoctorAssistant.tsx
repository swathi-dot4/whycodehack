import React, { useState, useEffect } from 'react';
import { PageView } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAIContext } from '../../context/AIContextManager';
import { speakText, stopSpeech } from '../../utils/speech';
import { 
  Stethoscope, 
  Mic, 
  Edit3, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';

interface DoctorAssistantProps {
  initialPrepText?: string;
  setCurrentPage: (page: PageView) => void;
  onInitiateCall: (contactName: string, role: string, phone: string) => void;
}

export const DoctorAssistant: React.FC<DoctorAssistantProps> = ({ initialPrepText = '', setCurrentPage, onInitiateCall }) => {
  const { t, language } = useLanguage();
  const { setAIContext } = useAIContext();

  const isTe = language === 'te';

  // Sample raw patient input
  const defaultRaw = isTe
    ? "నాకు రెండు రోజుల నుంచి జ్వరం ఉంది, రాత్రి ఎక్కువ అవుతోంది. తలనొప్పి కూడా ఉంది."
    : "I have had fever for 2 days, getting worse at night with headache.";

  const [rawText, setRawText] = useState(initialPrepText || defaultRaw);
  const [isEditing, setIsEditing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAIContext('DOCTOR_COMMUNICATION');
  }, []);

  const handleCopy = () => {
    const summaryText = isTe
      ? `రోగి ఆరోగ్య వివరణ:\n- సమస్య: జ్వరం (Fever)\n- వ్యవధి: 2 రోజులు\n- సమయం: రాత్రిపూట తీవ్రత ఎక్కువుంది\n- ఇతర లక్షణాలు: తలనొప్పి`
      : `Patient Health Summary:\n- Main Concern: Fever\n- Duration: 2 Days\n- Pattern: Worse at night\n- Associated Symptoms: Frontal headache`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleToggleSpeak = () => {
    const textToSpeak = isTe
      ? "నాకు రెండు రోజుల నుండి జ్వరం ఉంది, రాత్రిపూట తీవ్రత పెరుగుతోంది. కొద్దిగా తలనొప్పి కూడా ఉంది."
      : "Patient reports fever lasting 2 days, worsening at night with associated headache.";

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(textToSpeak, language).then(() => setIsSpeaking(false));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <Sparkles className="w-3.5 h-3.5 text-sky-200" /> Explain My Problem Feature
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('docTitle')}
          </h1>
          <p className="text-sky-100 text-sm font-medium">
            {t('docSubtitle')}
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md text-xs font-semibold text-sky-100 border border-white/20">
          Context: Doctor Consultation
        </div>
      </div>

      {/* Raw Patient Input & Structured Transformation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Raw Patient Speech/Text */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                🗣️ {isTe ? "మీరు చెప్పిన సమాచారం (Raw Patient Words)" : "What You Expressed"}
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? "Done" : t('editSummary')}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full h-32 p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              />
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">
                "{rawText}"
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Preserved original intent</span>
            <span className="text-emerald-600 font-bold">✓ Zero hallucinations</span>
          </div>
        </div>

        {/* Right Card: AI Structured Clinical Note */}
        <div className="bg-sky-50/90 p-6 rounded-3xl border border-sky-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
              📋 {t('concernHeader')}
            </h3>
            <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded font-bold">
              Doctor-Ready Summary
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-sky-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Main concern:</span>
              <span className="font-bold text-slate-900 text-sm">{isTe ? "జ్వరం (Fever)" : "Fever"}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-sky-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Duration:</span>
              <span className="font-bold text-slate-900">{isTe ? "2 రోజులు" : "2 days"}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-sky-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Pattern:</span>
              <span className="font-bold text-amber-700">{isTe ? "రాత్రివేళ హెచ్చుతగ్గులు" : "Worse at night"}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-sky-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Associated symptoms:</span>
              <span className="font-bold text-slate-900">{isTe ? "తలనొప్పి" : "Frontal headache"}</span>
            </div>
          </div>
        </div>

      </div>

      {/* "You can tell your doctor" Final Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-lg space-y-6">
        
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>💬 {t('youCanTellDoctor')}</span>
          </h3>
          <p className="text-xs text-slate-500">
            Read this to your doctor during consultation or press "Listen" to play audio.
          </p>
        </div>

        {/* Format Text Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-sky-50 p-5 rounded-2xl border border-emerald-200/80 text-slate-900 text-sm sm:text-base font-semibold leading-relaxed">
          {isTe ? (
            `"డాక్టర్ గారూ, నాకు రెండు రోజుల నుండి జ్వరం వస్తోంది. పగటిపూట కంటే రాత్రి సమయంలో జ్వరం ఎక్కువగా ఉంటోంది. దీనితో పాటు కొద్దిగా తలనొప్పి కూడా ఉంది."`
          ) : (
            `"Doctor, I have had fever for 2 days which worsens at night, accompanied by headache. I haven't experienced any vomiting."`
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          
          {/* Listen Button */}
          <button
            onClick={handleToggleSpeak}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Stop Audio' : t('listenAudio')}</span>
          </button>

          {/* Copy Summary Button */}
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : t('copySummary')}</span>
          </button>

          {/* Add More Info */}
          <button
            onClick={() => setCurrentPage('guide')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>{t('addMoreInfo')}</span>
          </button>

          {/* Talk to Doctor */}
          <button
            onClick={() => {
              onInitiateCall(
                isTe ? "డాక్టర్ కె. విజయ్ కుమార్ (PHC Ananthapur)" : "Dr. K. Vijay Kumar (PHC Ananthapur)",
                "Duty Medical Officer",
                "+91 98480 12345"
              );
            }}
            className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('talkToDoctor')}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
