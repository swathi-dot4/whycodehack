import React, { useState } from 'react';
import { Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sparkles, 
  MessageSquare, 
  ArrowRightLeft,
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface AICommunicatorProps {
  patientLanguage?: Language;
  doctorLanguage?: Language;
}

export const AICommunicator: React.FC<AICommunicatorProps> = ({
  patientLanguage = 'te',
  doctorLanguage = 'en'
}) => {
  const { t } = useLanguage();
  const [sourceLang, setSourceLang] = useState<Language>(patientLanguage);
  const [targetLang, setTargetLang] = useState<Language>(doctorLanguage);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'TRANSLATE' | 'EXPLAIN'>('TRANSLATE');

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTranslateForDoctor = () => {
    if (!inputText.trim()) return;

    if (sourceLang === 'te' && targetLang === 'en') {
      setTranslatedText(`Patient reports: "${inputText}". Primary symptom is fever with chills for 3 days. No previous allergy history recorded.`);
      setSimplifiedText("Patient has body fever and chills. Recommending temperature check and hydration.");
    } else if (sourceLang === 'en' && targetLang === 'te') {
      setTranslatedText(`డాక్టర్ చెప్పారు: "${inputText}". దయచేసి ప్రతిరోజు ఉదయం మరియు రాత్రి ఈ మందులు వేసుకోండి.`);
      setSimplifiedText("డాక్టర్ గారు మందులను క్రమం తప్పకుండా వేసుకోవాలని మరియు విశ్రాంతి తీసుకోవాలని సూచించారు.");
    } else {
      setTranslatedText(`[AI Translated (${sourceLang} → ${targetLang})]: ${inputText}`);
      setSimplifiedText(`Simplified summary for clear understanding.`);
    }
  };

  const handleSpeakText = (textToSpeak: string) => {
    if (!textToSpeak) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      
      if (targetLang === 'te') utterance.lang = 'te-IN';
      else if (targetLang === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';

      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-5 border border-slate-700/60 shadow-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              AI Communicator Helper
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Translation
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Bridge language barriers during tele-consultation
            </p>
          </div>
        </div>

        {/* Language selector pill */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
          <span className="text-emerald-400 uppercase">{sourceLang}</span>
          <button 
            onClick={handleSwapLanguages} 
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-sky-400 uppercase">{targetLang}</span>
        </div>
      </div>

      {/* Preset Phrases Quick Tap */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Quick Patient Statements (Telugu → English):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            "నిన్నటి నుండి తీవ్రమైన జ్వరం మరియు వణుకు ఉంది",
            "నాకు 3 రోజుల నుండి కడుపునొప్పిగా ఉంది",
            "బిపి మందులు ఎప్పుడు వేసుకోవాలి?",
            "డాక్టర్ గారు చెప్పిన వివరాలు మళ్ళీ చెప్పండి"
          ].map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(phrase);
                setSourceLang('te');
                setTargetLang('en');
              }}
              className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition-colors text-left"
            >
              "{phrase}"
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={sourceLang === 'te' ? "తెలుగులో చెప్పండి లేదా టైప్ చేయండి..." : "Type doctor notes or questions in English..."}
          rows={2}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 font-medium focus:outline-none focus:border-sky-500"
        />

        <div className="flex gap-2">
          <button
            onClick={handleTranslateForDoctor}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1.5"
          >
            <Languages className="w-4 h-4" />
            <span>Translate for Doctor</span>
          </button>

          <button
            onClick={() => {
              handleTranslateForDoctor();
              setActiveTab('EXPLAIN');
            }}
            className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Explain to Patient</span>
          </button>
        </div>
      </div>

      {/* Translated Result Output */}
      {translatedText && (
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Translated Output ({sourceLang.toUpperCase()} → {targetLang.toUpperCase()}):
            </span>

            <div className="flex items-center gap-1">
              {isPlayingAudio ? (
                <button
                  onClick={handleStopAudio}
                  className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSpeakText(translatedText)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Speak</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-100 font-semibold leading-relaxed">
            {translatedText}
          </p>

          {simplifiedText && (
            <div className="pt-2 border-t border-slate-800 text-[11px] text-sky-300 font-medium flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span><strong>Simplified:</strong> {simplifiedText}</span>
            </div>
          )}
        </div>
      )}

      {/* Safety Principle */}
      <div className="pt-1 text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Core principle: AI guides. Healthcare professionals decide.</span>
      </div>

    </div>
  );
};
