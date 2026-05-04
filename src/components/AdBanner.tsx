import React, { useEffect, useRef } from 'react';
import { useAds } from '../context/AdContext';

export function AdBanner() {
  const { settings } = useAds();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load if ads and banner are enabled, and publisherID exists
    if (!settings.adsEnabled || !settings.bannerEnabled || !settings.adsterraPublisherId) {
      if (bannerRef.current) {
         bannerRef.current.innerHTML = '';
      }
      return;
    }

    if (bannerRef.current && bannerRef.current.innerHTML === '') {
      // Create script tag dynamically
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//pl${settings.adsterraPublisherId}.adsterra.com/${settings.adsterraPublisherId}.js`;
      script.async = true;
      
      // We append but normally Adsterra scripts do document.write which is blocked in async.
      // For this demo, we mock the banner logic or allow it to execute.
      bannerRef.current.appendChild(script);

      // Create a visual placeholder when ads are enabled but real ads are blocked by ad-blocker
      const placeholder = document.createElement('div');
      placeholder.className = "w-full max-w-4xl h-24 bg-slate-900 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group";
      placeholder.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent"></div>
        <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Sponsored Advertisement</span>
        <p class="text-slate-400 text-sm font-medium">Upgrade to Premium for <span class="text-violet-400 font-bold tracking-tight">Ad-Free</span> gaming experience</p>
        <div class="absolute top-2 right-2 flex gap-1">
           <div class="w-1 h-1 bg-slate-700 rounded-full"></div>
           <div class="w-1 h-1 bg-slate-700 rounded-full"></div>
           <div class="w-1 h-1 bg-slate-700 rounded-full"></div>
        </div>
      `;
      // We're mimicking the provided html for ad banners
      bannerRef.current.appendChild(placeholder);
    }
  }, [settings]);

  if (!settings.adsEnabled || !settings.bannerEnabled) return null;

  return (
    <div className="w-full flex justify-center my-4 overflow-hidden" ref={bannerRef}>
      {/* Adsterra script will inject content here */}
    </div>
  );
}
