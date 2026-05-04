import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface GameCardProps {
  key?: React.Key;
  game: {
    _id: string;
    title: string;
    thumbnail: string;
    category: string;
    rating: number;
    plays: number;
  };
}

export function GameCard({ game }: GameCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/game/${game._id}`} className="block group">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group hover:border-violet-500/50 transition-all duration-300 ease-in-out flex flex-col h-full hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]">
          {/* Thumbnail Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
            <img 
              src={game.thumbnail} 
              alt={game.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          
          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-violet-300 transition-colors duration-300 ease-in-out">
                {game.title}
              </h3>
              <span className="px-2 py-1 bg-slate-800 text-cyan-400 text-[10px] font-black rounded uppercase ml-2 shrink-0">
                {game.category}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-yellow-400 mb-4 mt-auto">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${game.rating >= star ? 'fill-current' : game.rating >= star - 0.5 ? 'fill-current opacity-50' : 'text-slate-700 fill-current'}`} 
                />
              ))}
              <span className="text-slate-400 text-xs ml-1 font-bold">{game.rating.toFixed(1)}</span>
            </div>
            
            <button className="w-full py-3 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-wide group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 ease-in-out group-active:scale-95">
              Play Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
