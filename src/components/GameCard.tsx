import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link to={`/game/${game._id}`} className="block relative group h-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-full group-hover:border-violet-500/50 group-hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]">
          
          {/* Thumbnail Container */}
          <div className="relative aspect-square overflow-hidden bg-slate-800">
            <img 
              src={game.thumbnail} 
              alt={game.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_15px_rgba(139,92,246,0.6)]">
                <Play className="w-6 h-6 text-white ml-1 fill-current" />
              </div>
            </div>
            
            {/* Category Tag */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-wider border border-white/10">
              {game.category}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3 flex flex-col justify-between bg-slate-900">
            <h3 className="font-bold text-sm sm:text-base text-slate-100 line-clamp-1 group-hover:text-violet-400 transition-colors duration-300 ease-in-out">
              {game.title}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Plays: {game.plays}</span>
              <span className="text-[10px] sm:text-xs text-yellow-400 font-bold flex items-center">
                ★ {game.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
