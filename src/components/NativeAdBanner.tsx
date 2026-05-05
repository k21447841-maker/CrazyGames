import React, { useEffect, useRef } from 'react';
import { useAds } from '../context/AdContext';

export function NativeAdBanner() {
  const { settings } = useAds();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settings.adsEnabled) {
      if (bannerRef.current) {
         bannerRef.current.innerHTML = '';
      }
      return;
    }

    if (bannerRef.current && bannerRef.current.innerHTML === '') {
      const container = document.createElement('div');
      container.className = "flex flex-col items-center justify-center w-full my-6 relative";

      // Placeholder fallback for Adblockers / Dev Mode
      const placeholder = document.createElement('div');
      placeholder.className = "w-full max-w-[300px] h-[250px] bg-slate-900 border border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center absolute -z-10";
      placeholder.innerHTML = `
        <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Advertisement</span>
        <p class="text-slate-500 text-xs font-medium">Native Banner (300x250)</p>
      `;
      container.appendChild(placeholder);

      const iframe = document.createElement('iframe');
      iframe.width = "300";
      iframe.height = "250";
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.scrolling = "no";
      iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
          </head>
          <body>
            <div id="container-d90a807cd13f1e7f8e4dfe49616d217e"></div>
            <script async="async" data-cfasync="false" src="https://pl29339769.profitablecpmratenetwork.com/d90a807cd13f1e7f8e4dfe49616d217e/invoke.js"></script>
          </body>
        </html>
      `;
      
      container.appendChild(iframe);
      bannerRef.current.appendChild(container);
    }
  }, [settings]);

  if (!settings.adsEnabled) return null;

  return <div className="w-full flex justify-center overflow-hidden" ref={bannerRef} />;
}
