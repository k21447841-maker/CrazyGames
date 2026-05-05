import React from 'react';
import { GamepadIcon, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-12 mt-auto shrink-0 z-10 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-6 relative z-10">
        <div className="flex items-center space-x-3 text-slate-400 group">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <GamepadIcon className="w-4 h-4 text-violet-400" />
          </div>
          <span className="font-black tracking-widest text-slate-300 uppercase">CrazyGames</span>
        </div>
        <p className="text-sm font-medium text-slate-500 flex items-center">
          Built with <Heart className="w-4 h-4 text-pink-500 mx-2 fill-current" /> for gamers everywhere
        </p>
        <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">
          © {new Date().getFullYear()} CrazyGames. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
