const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  // Games
  getGames: async () => fetch(`${API_BASE}/games`).then(res => res.json()),
  getAdminGames: async () => fetch(`${API_BASE}/games/admin`, { headers: getAuthHeader() }).then(res => res.json()),
  getGame: async (id: string) => fetch(`${API_BASE}/games/${id}`).then(res => res.json()),
  createGame: async (data: any) => fetch(`${API_BASE}/games`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data)
  }).then(res => res.json()),
  updateGame: async (id: string, data: any) => fetch(`${API_BASE}/games/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteGame: async (id: string) => fetch(`${API_BASE}/games/${id}`, {
    method: 'DELETE', headers: getAuthHeader()
  }).then(res => res.json()),
  rateGame: async (id: string, rating: number) => fetch(`${API_BASE}/games/${id}/rate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating })
  }).then(res => res.json()),
  
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },
  
  // Ads
  getAdSettings: async () => fetch(`${API_BASE}/ads/settings`).then(res => res.json()),
  updateAdSettings: async (data: any) => fetch(`${API_BASE}/ads/settings`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data)
  }).then(res => res.json()),
};
