import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAds } from '../context/AdContext';
import { LogOut, Plus, Trash2, Settings, ListVideo, ToggleLeft, ToggleRight, Gamepad2, Database } from 'lucide-react';
import { generateMoreGames } from '../seedData';
import { Loading } from '../components/ui/Loading';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { settings, reloadSettings } = useAds();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'games' | 'ads' | 'add'>('games');
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());

  // Form states
  const [formData, setFormData] = useState({ title: '', description: '', thumbnail: '', embedUrl: '', category: 'Action', tags: '' });
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [adForm, setAdForm] = useState(settings);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchData();
    setSelectedGames(new Set());
  }, [user]);

  useEffect(() => {
    setAdForm(settings);
  }, [settings]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminGames();
      setGames(data);
    } catch (err: any) {
      console.error(err);
      let errMsg = err?.message || 'Failed to fetch dashboard data.';
      try {
        const parsed = JSON.parse(errMsg);
        errMsg = parsed.error || errMsg;
      } catch (e) {}
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResetAllGames = async () => {
    if(!window.confirm("WARNING: Are you sure you want to delete ALL games? This cannot be undone.")) return;
    setSeeding(true);
    try {
      // Using batch delete logic inside loop for simplicity
      for (const game of games) {
        await api.deleteGame(game._id);
      }
      fetchData();
      alert("All games have been deleted successfully.");
    } catch (e: any) {
      console.error(e);
      alert("Error deleting games: " + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleSeedGames = async () => {
    if(!window.confirm("Seed 5 custom HTML5 games? This will add the games to your database.")) return;
    setSeeding(true);
    try {
      const gamesToSeed = generateMoreGames();
      for(const g of gamesToSeed) {
        await api.createGame({ ...g, tags: g.tags });
      }
      fetchData();
      alert("Successfully seeded custom HTML5 games!");
    } catch (e: any) {
      console.error(e);
      alert("Error seeding games: " + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedGames.size === games.length) {
      setSelectedGames(new Set());
    } else {
      setSelectedGames(new Set(games.map(g => g._id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedGames);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedGames(newSet);
  };

  const handleBulkUpdate = async (active: boolean) => {
    if (selectedGames.size === 0) return;
    setLoading(true);
    try {
      await api.bulkUpdateGames(Array.from(selectedGames), { active });
      fetchData();
      setSelectedGames(new Set());
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGames.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedGames.size} games forever?`)) return;
    setLoading(true);
    try {
      await api.bulkDeleteGames(Array.from(selectedGames));
      fetchData();
      setSelectedGames(new Set());
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    setError(null);
    setUploading(true);
    try {
      let finalThumbnailUrl = formData.thumbnail;
      let finalEmbedUrl = formData.embedUrl;

      await api.createGame({ ...formData, thumbnail: finalThumbnailUrl, embedUrl: finalEmbedUrl, tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean) });
      setFormData({ title: '', description: '', thumbnail: '', embedUrl: '', category: 'Action', tags: '' });
      setActiveTab('games');
      fetchData();
    } catch (err: any) {
      console.error(err);
      let errMsg = err?.message || 'Failed to add game.';
      try {
        const parsed = JSON.parse(errMsg);
        errMsg = parsed.error || errMsg;
      } catch (e) {}
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this game?')) {
      setError(null);
      try {
        await api.deleteGame(id);
        fetchData();
      } catch (err: any) {
        console.error(err);
        let errMsg = err?.message || 'Failed to delete game.';
        try {
          const parsed = JSON.parse(errMsg);
          errMsg = parsed.error || errMsg;
        } catch (e) {}
        setError(errMsg);
      }
    }
  };

  const handleSaveAdSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.updateAdSettings(adForm);
      await reloadSettings();
      alert('Ad settings updated successfully.');
    } catch (err: any) {
      console.error(err);
      let errMsg = err?.message || 'Failed to update settings.';
      try {
        const parsed = JSON.parse(errMsg);
        errMsg = parsed.error || errMsg;
      } catch (e) {}
      setError(errMsg);
    }
  };

  const ToggleBtn = ({ checked, onChange, label }: any) => (
    <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl">
      <span className="font-medium text-gray-300">{label}</span>
      <button type="button" onClick={() => onChange(!checked)} className="focus:outline-none">
        {checked ? <ToggleRight className="w-8 h-8 text-indigo-500" /> : <ToggleLeft className="w-8 h-8 text-gray-600" />}
      </button>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex h-full font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col h-screen sticky top-0 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-violet-600 to-pink-500 p-2 rounded-xl shadow-lg shadow-violet-500/20">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">Console</span>
        </div>
        <nav className="flex-1 p-6 flex flex-col gap-2">
          <button onClick={() => setActiveTab('games')} className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out font-semibold ${activeTab === 'games' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ListVideo className="w-5 h-5 mr-3" /> Manage Games
          </button>
          <button onClick={() => setActiveTab('add')} className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out font-semibold ${activeTab === 'add' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Plus className="w-5 h-5 mr-3" /> Add Game
          </button>
          <button onClick={handleResetAllGames} disabled={seeding} className="w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out font-semibold text-rose-400 hover:bg-rose-900/40 hover:text-rose-300 disabled:opacity-50">
            <Trash2 className="w-5 h-5 mr-3" /> {seeding ? 'Processing...' : 'Delete All Games'}
          </button>
          <button onClick={handleSeedGames} disabled={seeding} className="w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out font-semibold text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300 disabled:opacity-50">
            <Database className="w-5 h-5 mr-3" /> {seeding ? 'Seeding...' : 'Seed 5 Custom Games'}
          </button>
          <button onClick={() => setActiveTab('ads')} className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out font-semibold ${activeTab === 'ads' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="w-5 h-5 mr-3" /> Global Settings
          </button>
        </nav>
        <div className="p-6">
          <button onClick={handleLogout} className="w-full flex items-center p-3 text-red-500 font-semibold hover:bg-red-500/10 rounded-xl transition-all duration-300 ease-in-out">
            <LogOut className="w-5 h-5 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-rose-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold border border-rose-400/50 flex items-center space-x-3 max-w-2xl">
            <Settings className="w-5 h-5 opacity-50" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 hover:opacity-75 bg-rose-600 px-2 pl-3 py-1 pb-1.5 rounded-lg text-sm">×</button>
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'games' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black flex items-center"><ListVideo className="mr-3 w-8 h-8 text-violet-500" /> Game Library</h2>
                {selectedGames.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400 mr-2">{selectedGames.size} selected</span>
                    <button onClick={() => handleBulkUpdate(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                      Activate
                    </button>
                    <button onClick={() => handleBulkUpdate(false)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20">
                      Deactivate
                    </button>
                    <button onClick={handleBulkDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20">
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/80 text-slate-400 text-sm tracking-wide uppercase font-bold">
                    <tr>
                      <th className="p-5 font-bold w-12">
                        <input 
                          type="checkbox" 
                          checked={games.length > 0 && selectedGames.size === games.length}
                          onChange={handleToggleSelectAll}
                          className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-900 cursor-pointer transition-all"
                        />
                      </th>
                      <th className="py-5 pr-5 font-bold">Title</th>
                      <th className="p-5 font-bold">Category</th>
                      <th className="p-5 font-bold">Status</th>
                      <th className="p-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {games.map(game => (
                      <tr key={game._id} className={`hover:bg-slate-800/50 transition-colors duration-300 ease-in-out ${selectedGames.has(game._id) ? 'bg-violet-900/10' : ''}`}>
                        <td className="p-5">
                          <input 
                            type="checkbox" 
                            checked={selectedGames.has(game._id)}
                            onChange={() => handleToggleSelect(game._id)}
                            className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-900 cursor-pointer transition-all"
                          />
                        </td>
                        <td className="py-5 pr-5 font-bold text-white">{game.title}</td>
                        <td className="p-5"><span className="bg-slate-800 border border-slate-700 text-violet-400 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{game.category}</span></td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${game.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {game.active ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button onClick={() => handleDelete(game._id)} className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 ease-in-out">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {games.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-10 text-center font-medium text-slate-500 bg-slate-900/50">No games found. Go add some!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div>
              <h2 className="text-3xl font-black mb-8 flex items-center"><Plus className="mr-3 w-8 h-8 text-violet-500" /> Add New Game</h2>
              <form onSubmit={handleAddGame} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow shadow-inner shadow-black/20" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow shadow-inner shadow-black/20 appearance-none">
                      {['Action', 'Racing', 'Shooting', 'Puzzle', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow shadow-inner shadow-black/20" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center justify-between">
                    Thumbnail Image URL
                  </label>
                  <p className="text-xs text-slate-500 mb-2 font-medium">Paste an image URL directly.</p>
                  <input type="text" required value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow shadow-inner shadow-black/20" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center justify-between">
                    Game Embed URL
                  </label>
                  <p className="text-xs text-slate-500 mb-2 font-medium">Paste an iframe HTML5 embedded link or download link.</p>
                  <input type="text" required value={formData.embedUrl} onChange={e => setFormData({...formData, embedUrl: e.target.value})} placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow shadow-inner shadow-black/20" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Tags (Comma-separated)</label>
                  <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="retro, difficult, fast" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow shadow-inner shadow-black/20" />
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center gap-4">
                  <button type="submit" disabled={uploading} className={`w-full md:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black uppercase tracking-wider transition-all duration-300 ease-in-out shadow-lg shadow-violet-500/30 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploading ? 'Uploading...' : 'Publish Game'}
                  </button>
                  {uploading && <span className="text-violet-400 font-bold animate-pulse">Please wait while files upload...</span>}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'ads' && (
            <div>
              <h2 className="text-3xl font-black mb-8 flex items-center"><Settings className="mr-3 w-8 h-8 text-violet-500" /> Global Settings</h2>
              <form onSubmit={handleSaveAdSettings} className="space-y-6">
                
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="text-lg font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-4">Master Ad Switch</h3>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-bold text-xl text-white">Enable All Network Ads</p>
                      <p className="text-sm font-medium text-slate-400 mt-1">Master toggle for the entire platform.</p>
                    </div>
                     <button type="button" onClick={() => setAdForm({...adForm, adsEnabled: !adForm.adsEnabled})} className="focus:outline-none">
                        {adForm.adsEnabled ? <ToggleRight className="w-14 h-14 text-emerald-500 transition-colors duration-300 ease-in-out" /> : <ToggleLeft className="w-14 h-14 text-slate-600 transition-colors duration-300 ease-in-out" />}
                      </button>
                  </div>
                </div>

                <div className={`p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-xl transition-opacity ${!adForm.adsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <h3 className="text-lg font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-4">Ad Placements</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <ToggleBtn label="Display Banners" checked={adForm.bannerEnabled} onChange={(v: boolean) => setAdForm({...adForm, bannerEnabled: v})} />
                    <ToggleBtn label="Interstitials (Game Load)" checked={adForm.interstitialEnabled} onChange={(v: boolean) => setAdForm({...adForm, interstitialEnabled: v})} />
                    <ToggleBtn label="Rewarded Video Ads" checked={adForm.videoEnabled} onChange={(v: boolean) => setAdForm({...adForm, videoEnabled: v})} />
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Adsterra Key (Banner placement ID)</label>
                    <input 
                      type="text" 
                      value={adForm.adsterraPublisherId || ''} 
                      onChange={e => setAdForm({...adForm, adsterraPublisherId: e.target.value})} 
                      placeholder="e.g. abc123def456" 
                      className="w-full max-w-md bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow shadow-inner shadow-black/20" 
                    />
                  </div>
                </div>
                
                <div className="pt-6">
                  <button type="submit" className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black uppercase tracking-wider shadow-lg shadow-violet-500/30 transition-all duration-300 ease-in-out">
                    Save Changes
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
