import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 as GamepadIcon, ShieldCheck, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTokens } from '../hooks/useTokens';

export function Navbar() {
  const { user } = useAuth();
  const { tokens } = useTokens();

  const categories = ['Home', 'Action', 'Racing', 'Shooting', 'Puzzle'];

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:from-violet-500 group-hover:to-pink-400 transition-colors duration-300 ease-in-out">
              <GamepadIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white hidden sm:block">
              CrazyGames
            </span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-lg hidden md:block mx-8">
          <div className="flex items-center justify-center space-x-6">
             <Link to="/" className="text-sm font-bold text-violet-400">Home</Link>
             <Link to="/?category=Action" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Action</Link>
             <Link to="/?category=Racing" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Racing</Link>
             <Link to="/?category=Shooting" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Shooting</Link>
             <Link to="/?category=Puzzle" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Puzzle</Link>
             <Link to="/store" className="text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">Store</Link>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Link to="/store" className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 hover:border-yellow-500/50 px-3 py-1.5 rounded-lg shadow-inner shadow-black/20 group transition-all">
            <Coins className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-sm">{tokens}</span>
          </Link>

          {user ? (
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all duration-300 ease-in-out text-sm font-medium text-slate-300 hover:text-white">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          ) : (
            <Link to="/admin/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all duration-300 ease-in-out text-sm font-medium text-slate-300 hover:text-white">
              Login
            </Link>
          )}
        </div>
        
        {/* Mobile menu scroll */}
        <div className="flex items-center gap-4 mt-3 overflow-x-auto md:hidden pb-2 no-scrollbar">
             <Link to="/" className="text-sm font-bold text-violet-400 whitespace-nowrap">Home</Link>
             <Link to="/store" className="text-sm font-bold text-yellow-400 whitespace-nowrap bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">Store</Link>
             <Link to="/?category=Action" className="text-sm font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap">Action</Link>
             <Link to="/?category=Racing" className="text-sm font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap">Racing</Link>
             <Link to="/?category=Shooting" className="text-sm font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap">Shooting</Link>
             <Link to="/?category=Puzzle" className="text-sm font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap">Puzzle</Link>
        </div>
      </div>
    </nav>
  );
}
