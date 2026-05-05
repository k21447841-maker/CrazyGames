import React, { useState, useEffect } from 'react';
import { useTokens } from '../hooks/useTokens';
import { Store as StoreIcon, ShieldCheck, CarFront, Crosshair, Gem, Check } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

// Pre-defined limited items for the store
const STORE_ITEMS = [
  {
    id: 'skin_neon_drifter',
    title: 'Neon Drifter Car Skin',
    category: 'Vehicle',
    price: 300,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80',
    icon: <CarFront className="w-5 h-5" />
  },
  {
    id: 'skin_golden_ak',
    title: 'Golden AK-47',
    category: 'Weapon',
    price: 800,
    image: 'https://images.unsplash.com/photo-1595590424283-b8f1784cb2c8?auto=format&fit=crop&w=400&q=80',
    icon: <Crosshair className="w-5 h-5" />
  },
  {
    id: 'skin_shadow_ninja',
    title: 'Shadow Ninja Outfit',
    category: 'Character',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    id: 'item_cyber_bike',
    title: 'Cyberpunk Bike',
    category: 'Vehicle',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
    icon: <CarFront className="w-5 h-5" />
  },
  {
    id: 'item_diamond_glider',
    title: 'Diamond Glider',
    category: 'Accessory',
    price: 600,
    image: 'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?auto=format&fit=crop&w=400&q=80',
    icon: <Gem className="w-5 h-5" />
  }
];

function StoreItemCard({
  item,
  isOwned,
  canAfford,
  handleBuy,
  handleSell
}: {
  item: typeof STORE_ITEMS[0];
  isOwned: boolean;
  canAfford: boolean;
  handleBuy: (item: typeof STORE_ITEMS[0]) => void;
  handleSell: (item: typeof STORE_ITEMS[0]) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`bg-slate-900 border ${isOwned ? 'border-emerald-500/50 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]' : 'border-slate-800'} rounded-3xl overflow-hidden flex flex-col h-full group relative`}
      >
        <div style={{ transform: "translateZ(30px)" }} className="relative flex-1 aspect-[4/3] overflow-hidden m-4 rounded-xl border border-slate-700/50 bg-slate-900">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          
          <img style={{ transform: "translateZ(50px) scale(0.9)" }} src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-95" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

          <div style={{ transform: "translateZ(80px)" }} className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border border-white/10 flex items-center shadow-lg">
            {item.icon}
            <span className="ml-1">{item.category}</span>
          </div>
          {isOwned && (
            <div style={{ transform: "translateZ(80px)" }} className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider flex items-center shadow-lg shadow-emerald-500/20">
              <Check className="w-3 h-3 mr-1" /> Owned
            </div>
          )}
        </div>
        
        <div style={{ transform: "translateZ(20px)" }} className="p-5 flex flex-col flex-1 pt-0">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">{item.title}</h3>
          
          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Price</span>
              <span className="text-yellow-400 font-black flex items-center shadow-yellow-500/20">
                {item.price} Tokens
              </span>
            </div>
            
            {isOwned ? (
              <button 
                onClick={() => handleSell(item)}
                className="px-4 py-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-500/50 rounded-xl text-sm font-bold transition-colors"
                style={{ transform: "translateZ(40px)" }}
              >
                Sell ({Math.floor(item.price * 0.5)})
              </button>
            ) : (
              <button 
                onClick={() => handleBuy(item)}
                disabled={!canAfford}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
                  canAfford 
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                style={{ transform: "translateZ(40px)" }}
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Store() {
  const { tokens, spendTokens, addTokens } = useTokens();
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('owned_items');
    if (saved) {
      try {
        setOwnedItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveOwned = (items: string[]) => {
    setOwnedItems(items);
    localStorage.setItem('owned_items', JSON.stringify(items));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuy = (item: typeof STORE_ITEMS[0]) => {
    if (ownedItems.includes(item.id)) return;
    
    if (tokens >= item.price) {
      const success = spendTokens(item.price);
      if (success) {
        saveOwned([...ownedItems, item.id]);
        showNotification(`Successfully purchased ${item.title}!`, 'success');
      }
    } else {
      showNotification('Not enough tokens!', 'error');
    }
  };

  const handleSell = (item: typeof STORE_ITEMS[0]) => {
    if (!ownedItems.includes(item.id)) return;
    
    // Selling returns 50% of the price
    const sellPrice = Math.floor(item.price * 0.5);
    addTokens(sellPrice);
    
    const newOwned = ownedItems.filter(id => id !== item.id);
    saveOwned(newOwned);
    showNotification(`Sold ${item.title} for ${sellPrice} tokens.`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-pink-500"></div>
          
          <div className="flex items-center space-x-4 mb-6 md:mb-0 relative z-10">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-slate-700">
              <StoreIcon className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Virtual Item Store</h1>
              <p className="text-slate-400 font-medium">Buy and sell in-game cars, skins, and other exclusive virtual items.</p>
            </div>
          </div>
          
          <div className="bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[200px] shadow-inner relative z-10">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Your Balance</span>
            <div className="flex items-center text-yellow-400">
              <span className="text-4xl font-black mr-2">{tokens}</span>
              <span className="text-lg font-bold">Tokens</span>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-7xl mx-auto mb-6 p-4 rounded-xl font-bold flex items-center ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Store Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {STORE_ITEMS.map((item) => {
            const isOwned = ownedItems.includes(item.id);
            const canAfford = tokens >= item.price;
            
            return (
              <StoreItemCard
                key={item.id}
                item={item}
                isOwned={isOwned}
                canAfford={canAfford}
                handleBuy={handleBuy}
                handleSell={handleSell}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
