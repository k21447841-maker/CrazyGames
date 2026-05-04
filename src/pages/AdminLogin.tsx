import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.login();
      login(data.token, data.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md border-b border-slate-800 pb-8 mb-8">
        <div className="flex justify-center flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30 mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-center text-4xl font-black text-white tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-3 text-center text-sm font-medium text-slate-400 uppercase tracking-widest">
            Secure Access Console
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-10 px-8 shadow-2xl rounded-3xl border border-slate-800 text-center">
          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}
            
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 rounded-xl text-sm font-black text-white bg-violet-600 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 disabled:opacity-50 transition-all duration-300 ease-in-out uppercase tracking-widest shadow-lg shadow-violet-500/30 active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
