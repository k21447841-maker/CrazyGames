import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

export interface AdSettingsData {
  adsEnabled: boolean;
  bannerEnabled: boolean;
  interstitialEnabled: boolean;
  videoEnabled: boolean;
  adsterraPublisherId: string;
}

interface AdContextType {
  settings: AdSettingsData;
  reloadSettings: () => Promise<void>;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

const defaultSettings = {
  adsEnabled: false,
  bannerEnabled: false,
  interstitialEnabled: false,
  videoEnabled: false,
  adsterraPublisherId: ''
};

export function AdProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdSettingsData>(defaultSettings);

  const reloadSettings = async () => {
    try {
      const data = await api.getAdSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load ad settings', err);
    }
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  return (
    <AdContext.Provider value={{ settings, reloadSettings }}>
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const ctx = useContext(AdContext);
  if (!ctx) throw new Error('useAds must be used within an AdProvider');
  return ctx;
}
