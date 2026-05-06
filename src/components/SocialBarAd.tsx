import React, { useEffect, useState } from 'react';
import { useAds } from '../context/AdContext';

export function SocialBarAd() {
  const { settings } = useAds();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if script already exists to avoid duplicates
    const scriptId = 'adsterra-social-bar';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "//pl29339854.profitablecpmratenetwork.com/f9/33/d0/f933d0525bcadceb8dc18f6b19d55f5e.js";
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, []);

  return null;
}
