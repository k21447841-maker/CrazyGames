import React, { useEffect, useState } from 'react';
import { useAds } from '../context/AdContext';

export function SocialBarAd() {
  const { settings } = useAds();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!settings.adsEnabled || !visible) return;

    // Check if script already exists to avoid duplicates
    const scriptId = 'adsterra-social-bar';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "//pl29339854.profitablecpmratenetwork.com/f9/33/d0/f933d0525bcadceb8dc18f6b19d55f5e.js";
    script.async = true;
    
    document.body.appendChild(script);

    // Hide the ad after 10 seconds
    const timer = setTimeout(() => {
      // Find all newly added elements from adsterra and hide them
      // Removing the script
      const el = document.getElementById(scriptId);
      if (el) el.remove();
      
      // Since it's hard to know exactly what adsterra injects, 
      // we can try to hide common ad wrapper selectors
      const adWrappers = document.querySelectorAll('div[style*="z-index"][style*="fixed"]');
      adWrappers.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      setVisible(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [settings.adsEnabled, visible]);

  return null;
}
