import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 as GamepadIcon, ShieldCheck, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTokens } from '../hooks/useTokens';

export function Navbar() {
  const { user } = useAuth();
  const { tokens } = useTokens();

  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-full">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:from-violet-500 group-hover:to-pink-400 transition-colors duration-300 ease-in-out">
              <GamepadIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              PANEL STORE
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg shadow-inner shadow-black/20 mr-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-white text-sm">{tokens}</span>
          </div>

          {user ? (
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all duration-300 ease-in-out text-sm font-medium text-slate-300 hover:text-white">
              <ShieldCheck className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link to="/admin/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all duration-300 ease-in-out text-sm font-medium text-slate-300 hover:text-white">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
