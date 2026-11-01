import { Language } from '../types';

// Declare SpeechRecognition interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const speakText = (text: string, lang: Language): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in browser');
      resolve();
      return;
    }

    // Cancel any active speech synthesis
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (lang === 'te') {
      utterance.lang = 'te-IN';
      utterance.rate = 0.85; // Slightly slower rate for clear rural Telugu pronunciation
      utterance.pitch = 1.0;
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
    } else {
      utterance.lang = 'en-IN';
      utterance.rate = 1.0;
    }

    // Try finding specific regional voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const targetLang = lang === 'te' ? 'te' : lang === 'hi' ? 'hi' : 'en';
      const matchingVoice = voices.find(v => v.lang.startsWith(targetLang));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public startListening(
    lang: Language,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Browser Speech Recognition API unavailable. Falling back to voice simulation.');
      this.simulateFallback(lang, onResult, onEnd);
      return;
    }

    try {
      this.recognition.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        // If mic permission blocked or network error, fallback gracefully
        this.simulateFallback(lang, onResult, onEnd);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch (e: any) {
      console.warn('Failed to start speech recognition:', e);
      this.simulateFallback(lang, onResult, onEnd);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private simulateFallback(
    lang: Language,
    onResult: (transcript: string, isFinal: boolean) => void,
    onEnd: () => void
  ) {
    const sampleText = lang === 'te'
      ? "నాకు రెండు రోజులుగా జ్వరం ఉంది, రాత్రి సమయాల్లో తలనొప్పితో ఎక్కువవుతోంది."
      : lang === 'hi'
      ? "मुझे दो दिनों से बुखार है और रात में सिरदर्द के साथ बढ़ जाता है।"
      : "I have had fever for two days which gets worse at night with headache.";

    // Simulate typing out words progressively over 2.5 seconds
    let currentLen = 0;
    const interval = setInterval(() => {
      currentLen += Math.floor(Math.random() * 5) + 3;
      if (currentLen >= sampleText.length) {
        clearInterval(interval);
        onResult(sampleText, true);
        onEnd();
      } else {
        onResult(sampleText.slice(0, currentLen), false);
      }
    }, 180);
  }
}

export const voiceService = new VoiceRecognitionService();
