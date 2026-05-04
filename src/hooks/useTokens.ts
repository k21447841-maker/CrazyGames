import { useState, useEffect } from 'react';

export function useTokens() {
  const [tokens, setTokensState] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('arcade_tokens');
    if (saved) {
      setTokensState(parseInt(saved, 10));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arcade_tokens') {
        setTokensState(parseInt(e.newValue || '0', 10));
      }
    };
    
    // Also add a custom event for same-tab reactivity
    const handleCustomEvent = (e: CustomEvent) => {
      setTokensState(parseInt(e.detail || '0', 10));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('arcade_tokens_updated', handleCustomEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('arcade_tokens_updated', handleCustomEvent as EventListener);
    };
  }, []);

  const addTokens = (amount: number) => {
    setTokensState(prev => {
      const newTokens = prev + amount;
      localStorage.setItem('arcade_tokens', newTokens.toString());
      window.dispatchEvent(new CustomEvent('arcade_tokens_updated', { detail: newTokens.toString() }));
      return newTokens;
    });
  };

  const spendTokens = (amount: number) => {
    setTokensState(prev => {
      const newTokens = Math.max(0, prev - amount);
      localStorage.setItem('arcade_tokens', newTokens.toString());
      window.dispatchEvent(new CustomEvent('arcade_tokens_updated', { detail: newTokens.toString() }));
      return newTokens;
    });
  };

  return { tokens, addTokens, spendTokens };
}
