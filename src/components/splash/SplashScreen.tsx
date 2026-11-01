import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Exact 3-second timer
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 select-none animate-fade-in h-[100dvh] w-full overflow-hidden">
      
      {/* Centered Splash Content */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-xs sm:max-w-sm mx-auto my-auto">
        
        {/* Healthcare Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-xl border border-emerald-400/30 animate-pulse">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-white" />
        </div>

        {/* Prototype Name & Tagline */}
        <div className="space-y-2 pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            CareBridge AI
          </h1>
          
          <p className="text-sm sm:text-base font-bold text-emerald-700 leading-snug px-2">
            Healthcare guidance in your language.
          </p>
        </div>

      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className="pb-8 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium text-center">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        <span>Loading healthcare guidance...</span>
      </div>

    </div>
  );
};
