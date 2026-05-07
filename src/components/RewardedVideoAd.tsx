import React, { useState, useEffect, useRef } from 'react';
import { useAds } from '../context/AdContext';
import { X, Play, Coins, Loader2 } from 'lucide-react';
import { useTokens } from '../hooks/useTokens';

export function RewardedVideoAd({ onClose, onReward }: { onClose: () => void, onReward: () => void }) {
  useEffect(() => {
     onReward();
     onClose();
  }, [onReward, onClose]);

  return null;
}
