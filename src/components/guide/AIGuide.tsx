import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAIContext } from '../../context/AIContextManager';
import { useOffline } from '../../context/OfflineContext';
import { speakText, stopSpeech, voiceService } from '../../utils/speech';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Stethoscope,
  BookmarkPlus,
  RefreshCw,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface AIGuideProps {
  initialPrompt?: string;
  setCurrentPage: (page: PageView) => void;
  setDoctorPrepText: (text: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  structured?: {
    problem: string;
    duration: string;
    additional: string;
  };
  clarifications?: string[];
  timestamp: string;
}

export const AIGuide: React.FC<AIGuideProps> = ({ initialPrompt = '', setCurrentPage, setDoctorPrepText }) => {
  const { t, language } = useLanguage();
  const { setAIContext } = useAIContext();
  const { isOffline, addOfflineRequest } = useOffline();

  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceCaptured, setIsVoiceCaptured] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isTe = language === 'te';

  // Initialize with welcoming AI message
  useEffect(() => {
    setAIContext('SYMPTOM_GUIDANCE');

    const welcomeMsg: Message = {
      id: 'msg-welcome',
      sender: 'ai',
      text: isTe
        ? "నమస్కారం! మీ ఆరోగ్య సమస్యను మీ స్వంత మాటల్లో నాకు చెప్పండి. నేను దాన్ని డాక్టర్‌కు స్పష్టంగా వివరించడంలో సహాయం చేస్తాను."
        : "Hello! Tell me what health concern you are experiencing in your own words. I will help you organize your concern clearly for a healthcare professional.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([welcomeMsg]);

    if (initialPrompt.trim()) {
      handleProcessQuery(initialPrompt);
    }
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleProcessQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsVoiceCaptured(false);

    // Save offline request if offline
    if (isOffline) {
      addOfflineRequest({
        type: 'SYMPTOM',
        title: `Offline Guidance query: ${query.slice(0, 30)}...`,
        content: query,
        language: language,
        patientId: 'pt-102'
      });
    }

    // AI Response processing simulation
    setTimeout(() => {
      let problem = "Fever & Headache";
      let duration = "2 days (worse at night)";
      let additional = "Severe frontal pain, no vomiting";

      if (query.toLowerCase().includes('stomach') || query.includes('కడుపు')) {
        problem = isTe ? "కడుపు నొప్పి (Stomach Pain)" : "Stomach Pain";
        duration = isTe ? "నిన్నటి నుండి" : "Since yesterday";
        additional = isTe ? "ఆహారం తర్వాత ఎక్కువవుతోంది" : "Increases after food intake";
      } else if (query.toLowerCase().includes('fever') || query.includes('జ్వరం')) {
        problem = isTe ? "జ్వరం (Fever)" : "Fever & Bodyache";
        duration = isTe ? "2 రోజుల నుండి" : "2 days (worse at night)";
        additional = isTe ? "రాత్రిపూట ఎక్కువవుతోంది" : "Worsening at night";
      }

      const aiText = isTe
        ? `నేను ఈ సమాచారాన్ని ఆరోగ్య నిపుణుడికి స్పష్టంగా వివరించడంలో మీకు సహాయపడగలను. ఈ వివరాలు డాక్టర్‌కి మీ పరిస్థితిని త్వరగా అర్థం చేసుకోవడానికి ఉపయోగిపడతాయి.`
        : `I can help you describe this clearly to a healthcare professional. This information can help a doctor understand your concern quickly.`;

      const clarifications = isTe ? [
        "1. ఇవి ఎప్పుడు ప్రారంభమయ్యాయి?",
        "2. నొప్పి లేదా ఇబ్బంది ఎక్కడ అనిపిస్తోంది?",
        "3. వేరే ఇతర లక్షణాలు (వాంతులు, అలసట) ఉన్నాయా?"
      ] : [
        "1. When did it start?",
        "2. Where exactly do you feel the pain?",
        "3. Would you like to mention any other symptoms?"
      ];

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        structured: { problem, duration, additional },
        clarifications,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // Auto read AI response
      speakText(aiText, language);
      setIsSpeaking(true);
    }, 850);
  };

  // Fixed Telugu & English Speech-to-Text Voice Input handler
  const handleMicToggle = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setIsVoiceCaptured(false);

      voiceService.startListening(
        language,
        (transcript: string, isFinal: boolean) => {
          setInputQuery(transcript);
          if (isFinal) {
            setIsVoiceCaptured(true);
          }
        },
        (error: string) => {
          console.warn(error);
        },
        () => {
          setIsListening(false);
          setIsVoiceCaptured(true);
        }
      );
    }
  };

  const handleToggleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, language).then(() => setIsSpeaking(false));
    }
  };

  const handleSendToDoctorAssistant = (structuredMsg: Message) => {
    const summaryText = `${structuredMsg.structured?.problem || ''} - Duration: ${structuredMsg.structured?.duration || ''}. ${structuredMsg.structured?.additional || ''}`;
    setDoctorPrepText(summaryText);
    setAIContext('DOCTOR_COMMUNICATION');
    setCurrentPage('doctor');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-black shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              {t('guideTitle')}
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                Non-Diagnostic Guide
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {t('guideSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            const welcomeMsg: Message = {
              id: 'msg-welcome',
              sender: 'ai',
              text: isTe
                ? "నమస్కారం! మీ ఆరోగ్య సమస్యను మీ స్వంత మాటల్లో నాకు చెప్పండి."
                : "Hello! Tell me what health concern you are experiencing in your own words.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([welcomeMsg]);
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-50/80 rounded-3xl p-4 sm:p-6 border border-slate-200 min-h-[420px] max-h-[550px] overflow-y-auto space-y-6">
        
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex gap-3 ${isAi ? 'items-start' : 'items-end flex-row-reverse'}`}>
              
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isAi ? 'bg-gradient-to-tr from-emerald-600 to-sky-500 text-white' : 'bg-slate-800 text-white'
              }`}>
                {isAi ? <Bot className="w-5 h-5" /> : <span className="text-xs font-bold">You</span>}
              </div>

              {/* Message Content Bubble */}
              <div className={`space-y-3 max-w-2xl ${
                isAi 
                  ? 'bg-white text-slate-800 rounded-3xl rounded-tl-none p-5 border border-slate-200 shadow-sm'
                  : 'bg-emerald-600 text-white rounded-3xl rounded-tr-none p-4 shadow-sm'
              }`}>
                <div className="flex items-center justify-between gap-4 text-xs font-medium opacity-80 border-b pb-2 mb-2 border-slate-100">
                  <span className="font-bold">{isAi ? 'CareBridge AI AI Guide' : 'Patient'}</span>
                  <span className="text-[10px]">{msg.timestamp}</span>
                </div>

                <p className="text-sm sm:text-base leading-relaxed font-normal">
                  {msg.text}
                </p>

                {/* Structured Extraction Card */}
                {msg.structured && (
                  <div className="bg-sky-50/90 rounded-2xl p-4 border border-sky-200 space-y-2 mt-3">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-900 uppercase tracking-wider">
                      <span>📋 Extracted Information (User Provided)</span>
                      <span className="text-[10px] text-sky-700 bg-sky-200 px-2 py-0.5 rounded">Structured for Doctor</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                        <span className="text-slate-500 font-medium block">Main concern:</span>
                        <span className="font-bold text-slate-900">{msg.structured.problem}</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                        <span className="text-slate-500 font-medium block">Duration:</span>
                        <span className="font-bold text-slate-900">{msg.structured.duration}</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                        <span className="text-slate-500 font-medium block">Additional info:</span>
                        <span className="font-bold text-slate-900">{msg.structured.additional}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clarification Prompts */}
                {msg.clarifications && (
                  <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 space-y-2">
                    <div className="text-xs font-bold text-amber-900">
                      💡 Simple Clarification Questions:
                    </div>
                    <ul className="space-y-1 text-xs text-amber-950 font-medium">
                      {msg.clarifications.map((c, i) => (
                        <li 
                          key={i} 
                          onClick={() => setInputQuery(c.replace(/^\d+\.\s*/, ''))}
                          className="cursor-pointer hover:underline"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Audio & Prepare Doctor Note Actions */}
                {isAi && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => handleToggleSpeak(msg.text)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5 text-sky-600" />}
                      <span>{isSpeaking ? 'Stop Audio' : (isTe ? '🔊 తెలుగు వాయిస్ వినండి' : 'Listen Audio')}</span>
                    </button>

                    {msg.structured && (
                      <button
                        onClick={() => handleSendToDoctorAssistant(msg)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{isTe ? 'డాక్టర్ కోసం నివేదిక మార్చు ("Explain My Problem")' : 'Prepare Doctor Summary'}</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Live Mic Listening Status Box */}
        {isListening && (
          <div className="p-4 bg-emerald-100 rounded-2xl border border-emerald-300 flex items-center gap-3 animate-pulse">
            <Mic className="w-6 h-6 text-emerald-700 animate-bounce" />
            <div className="space-y-0.5">
              <div className="text-xs font-black text-emerald-950 flex items-center gap-1">
                🎤 {t('listening')} {isTe ? "(తెలుగులో మాట్లాడండి...)" : "(Speak now...)"}
              </div>
              <p className="text-[11px] text-emerald-800">Recording audio input in {isTe ? 'Telugu (te-IN)' : 'English'}</p>
            </div>
          </div>
        )}

        {isVoiceCaptured && (
          <div className="p-2.5 bg-sky-100 text-sky-900 rounded-xl border border-sky-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span>✓ Voice captured: "{inputQuery}"</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-lg space-y-3">
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessQuery(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-3.5 rounded-2xl text-white font-bold transition-all shadow ${
              isListening ? 'bg-rose-600 hover:bg-rose-700 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title="Click to speak (Voice Input in Telugu/English)"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('typePlaceholder')}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-bold transition-all shadow"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            CareBridge AI provides guidance and communication support. It does not diagnose medical conditions.
          </span>
          <span className="hidden sm:inline text-slate-400">Press enter to send</span>
        </div>

      </div>

    </div>
  );
};
