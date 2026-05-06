import React, { useEffect, useRef } from 'react';
import { useAds } from '../context/AdContext';

export function AdBanner() {
  const { settings } = useAds();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && bannerRef.current.innerHTML === '') {
      const container = document.createElement('div');
      container.className = "flex flex-col items-center justify-center w-full my-4 relative";

      // Placeholder fallback for Adblockers / Dev Mode
      const placeholder = document.createElement('div');
      placeholder.className = "w-full max-w-[728px] h-[90px] bg-slate-900 border border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center absolute -z-10";
      placeholder.innerHTML = `
        <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Advertisement</span>
        <p class="text-slate-500 text-xs font-medium">Your Adsterra Banner Will Appear Here</p>
      `;
      container.appendChild(placeholder);

      // Only add iframe if publisher ID is configured
      if (settings.adsterraPublisherId) {
        const iframe = document.createElement('iframe');
        iframe.width = "728";
        iframe.height = "90";
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
              <script type="text/javascript">
                atOptions = {
                  'key' : '${settings.adsterraPublisherId}',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/${settings.adsterraPublisherId}/invoke.js"></script>
            </body>
          </html>
        `;
        
        container.appendChild(iframe);
      } else {
        // If no publisher ID, make placeholder visible (z-index) so user can see it
        placeholder.className = "w-full max-w-[728px] h-[90px] bg-slate-900 border border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center";
      }
      
      bannerRef.current.appendChild(container);
    }
  }, [settings]);

  return <div className="w-full flex justify-center overflow-hidden" ref={bannerRef} />;
}
