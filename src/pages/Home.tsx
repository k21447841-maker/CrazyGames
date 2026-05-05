import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { GameCard } from '../components/GameCard';
import { Loading } from '../components/ui/Loading';
import { Search } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    api.getGames().then(data => {
      setGames(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(games.map(g => g.category)))].filter(Boolean);

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/20 mb-6">
            <span className="text-3xl">🕹️</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Premium Gaming <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Panels</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Discover the best free panels and mods for Free Fire, BGMI, and more. Enhance your gameplay safely.
          </p>
        </div>
      </div>

      <AdBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out ${
                  selectedCategory === cat 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white bg-slate-900/50 border border-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors duration-300 ease-in-out">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search your favorite panels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 ease-in-out shadow-inner shadow-black/20"
            />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, index) => (
              <React.Fragment key={game._id}>
                <GameCard game={game} />
                {/* Insert an In-Content Ad after every 8 games */}
                {(index + 1) % 8 === 0 && (
                  <div className="col-span-full py-4">
                    <AdBanner />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 border border-slate-800 rounded-3xl bg-slate-900/50">
            <p className="text-lg font-medium">No panels found matching your criteria.</p>
          </div>
        )}

        {/* Footer Ad */}
        {!loading && (
          <div className="mt-12 pt-8 border-t border-slate-800/50">
            <AdBanner />
          </div>
        )}
      </main>
    </div>
  );
}
