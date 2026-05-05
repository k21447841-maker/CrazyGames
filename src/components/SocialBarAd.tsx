import React, { useEffect, useState } from 'react';
import { useAds } from '../context/AdContext';
import { useLocation } from 'react-router-dom';

export function SocialBarAd() {
  const { settings } = useAds();
  const location = useLocation();
  const [shouldShowAd, setShouldShowAd] = useState(false);

  useEffect(() => {
    // Check if the user has played at least 1 game
    const gamesPlayed = parseInt(sessionStorage.getItem('gamesPlayed') || '0', 10);
    setShouldShowAd(gamesPlayed >= 1);
  }, [location.pathname]);

  useEffect(() => {
    if (!settings.adsEnabled || !shouldShowAd) return;

    // Check if script already exists to avoid duplicates
    const scriptId = 'adsterra-social-bar';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "//pl29339854.profitablecpmratenetwork.com/f9/33/d0/f933d0525bcadceb8dc18f6b19d55f5e.js";
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      // Removing the script tag might not remove the ad UI, but it cleans up the tag.
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [settings.adsEnabled, shouldShowAd]);

  return null;
}
