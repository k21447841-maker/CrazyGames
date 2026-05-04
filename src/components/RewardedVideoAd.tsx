import React, { useState, useEffect, useRef } from 'react';
import { useAds } from '../context/AdContext';
import { X, Play, Coins, Loader2 } from 'lucide-react';
import { useTokens } from '../hooks/useTokens';

export function RewardedVideoAd({ onClose, onReward }: { onClose: () => void, onReward: () => void }) {
  const { settings } = useAds();
  const [timeLeft, setTimeLeft] = useState(15); // 15 second simulated ad fallback
  const [rewardGranted, setRewardGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scriptEl: HTMLScriptElement | null = null;

    if (settings.adsEnabled && settings.videoEnabled && settings.adsterraPublisherId) {
      // Dynamically load the Adsterra ad script
      scriptEl = document.createElement('script');
      scriptEl.type = 'text/javascript';
      scriptEl.async = true;
      // Note: Adsterra typically gives custom URLs for rewarded video scripts. We use a placeholder based on the publisher ID.
      scriptEl.src = `//pl${settings.adsterraPublisherId}.adsterra.com/rewarded_video.js`;
      
      scriptEl.onload = () => {
        setLoading(false);
      };
      
      scriptEl.onerror = () => {
        console.warn('Adsterra script failed to load. Using simulated video ad fallback.');
        setLoading(false);
      };

      if (adContainerRef.current) {
        adContainerRef.current.appendChild(scriptEl);
      } else {
        document.body.appendChild(scriptEl);
      }
    } else {
      // Simulate loading the ad when settings are missing
      const loadTimer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(loadTimer);
    }

    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [settings]);

  useEffect(() => {
    // If the external script provides a global callback for completion, we could listen for it here.
    // For robust user experience, we maintain a fallback timer to ensure the user gets rewarded.
    let timer: NodeJS.Timeout;
    
    if (!loading && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !rewardGranted) {
      setRewardGranted(true);
      onReward();
      
      // Auto-close after acknowledging reward
      setTimeout(() => {
        onClose();
      }, 2500);
    }

    return () => clearInterval(timer);
  }, [loading, timeLeft, rewardGranted, onReward, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center flex-col font-sans">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {timeLeft > 0 ? (
          <div className="flex items-center bg-slate-800/80 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg shadow-black/50">
            Reward in {timeLeft}s
          </div>
        ) : (
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg shadow-black/50 transition-colors"
          >
            <X className="w-5 h-5" />
            Close
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-4 text-violet-500">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">Loading Advertisement...</p>
        </div>
      ) : (
        <div ref={adContainerRef} className="flex flex-col items-center max-w-lg w-full px-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-8 transform scale-110">
            <Coins className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2">Exclusive Offer</h2>
          <p className="text-slate-400 font-medium mb-8">
            This space is reserved for a Video Ad from Publisher {settings.adsterraPublisherId || 'N/A'}. 
            Please support us by watching until the end.
          </p>

          <div className="w-full bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10 mix-blend-overlay"></div>
             {rewardGranted ? (
               <div className="flex flex-col items-center gap-3 relative z-10">
                 <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <span className="text-4xl text-emerald-400">🎉</span>
                 </div>
                 <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider">Reward Granted!</p>
                 <p className="text-slate-400 text-sm">You earned +50 Tokens. Closing automatically...</p>
               </div>
             ) : (
                <div className="flex flex-col items-center gap-3 relative z-10 opacity-70">
                 <Play className="w-16 h-16 text-slate-500" />
                 <p className="text-slate-500 font-bold uppercase tracking-wider">Video Playing...</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
