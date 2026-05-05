import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loading } from '../components/ui/Loading';
import { ArrowLeft, Maximize, Star, PlayCircle, Coins } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { useAds } from '../context/AdContext';
import { useTokens } from '../hooks/useTokens';
import { RewardedVideoAd } from '../components/RewardedVideoAd';

export function GamePlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { settings } = useAds();
  const { tokens, addTokens } = useTokens();
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      api.getGame(id).then(data => {
        setGame(data);
        setLoading(false);
        const storedRating = localStorage.getItem(`rated_${id}`);
        if (storedRating) {
          setUserRating(parseInt(storedRating, 10));
        }
        
        // Tracking games played for Social Bar display logic
        const playedCount = parseInt(sessionStorage.getItem('gamesPlayed') || '0', 10);
        sessionStorage.setItem('gamesPlayed', (playedCount + 1).toString());
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  const handleRate = async (rating: number) => {
    if (!id || userRating > 0 || isRatingSubmitting) return;
    setIsRatingSubmitting(true);
    try {
      const updatedGame = await api.rateGame(id, rating);
      setGame(updatedGame);
      setUserRating(rating);
      localStorage.setItem(`rated_${id}`, rating.toString());
    } catch (err) {
      console.error('Failed to rate game:', err);
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loading /></div>;
  if (!game) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans font-medium">Game not found</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {showRewardedAd && (
        <RewardedVideoAd 
          onClose={() => setShowRewardedAd(false)} 
          onReward={() => addTokens(50)} 
        />
      )}
      
      <AdBanner />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-400 hover:text-white transition-all duration-300 ease-in-out font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl shadow-inner shadow-black/20">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-black text-white">{tokens} <span className="text-slate-400 font-medium text-sm ml-1 uppercase tracking-wider">Tokens</span></span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl mb-8">
          <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
            <h1 className="text-2xl font-black">{game.title}</h1>
            <button 
              onClick={toggleFullscreen}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-300 ease-in-out shadow-inner shadow-black/20"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative w-full aspect-video bg-black flex items-center justify-center p-0 bg-slate-950/50">
            {game.embedUrl && !game.embedUrl.includes('.apk') && !game.embedUrl.includes('.zip') && !game.embedUrl.includes('firebasestorage.googleapis.com') ? (
              <iframe
                ref={iframeRef}
                src={game.embedUrl}
                title={game.title}
                className="w-full h-full border-0"
                allowFullScreen
                scrolling="no"
                allow="autoplay; fullscreen; gamepad; focus-without-user-activation *; monetization; x-domain"
              ></iframe>
            ) : (
              <img src={game.thumbnail} alt={game.title} className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
            )}
          </div>
          
          <div className="p-6 md:p-8 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-8 mb-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-lg text-sm font-black uppercase tracking-wider">
                    {game.category}
                  </span>
                  <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-sm font-semibold">
                    {game.plays} Plays
                  </span>
                  <div className="flex items-center text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-lg font-bold text-sm">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span>{game.rating?.toFixed(1) || 0}</span>
                    <span className="text-slate-400 font-medium text-xs ml-1">({game.ratingCount || 0})</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Game Description</h2>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {game.description || "No description provided."}
                </p>
              </div>
              
              <div className="w-full md:w-auto flex flex-col gap-4">
                <a 
                  href={game.embedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 ease-in-out md:min-w-[250px]"
                >
                  <Maximize className="w-5 h-5" /> Play / Download Game
                </a>
                
                <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl space-y-4">
                  <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest text-center">Rate this Game</h3>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        disabled={userRating > 0 || isRatingSubmitting}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRate(star)}
                        className={`p-1.5 transition-all duration-200 ${(hoverRating || userRating) >= star ? 'text-yellow-400 scale-110' : 'text-slate-600 hover:text-yellow-400/50'} ${userRating > 0 ? 'cursor-default' : 'cursor-pointer hover:-translate-y-1'}`}
                      >
                        <Star className={`w-6 h-6 ${(hoverRating || userRating) >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && <p className="text-xs text-emerald-400 font-bold text-center mt-2">Thanks for rating!</p>}
                </div>

                {settings.adsEnabled && settings.videoEnabled && (
                  <button 
                    onClick={() => setShowRewardedAd(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white px-5 py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-violet-500/20 transition-all duration-300 ease-in-out group"
                  >
                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Watch Ad for +50 Tokens
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
