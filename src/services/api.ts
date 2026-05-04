const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      throw new Error((data && data.error) || data || res.statusText);
    }
    return data;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Server returned invalid response. Server might be down or restarting. Details: ${text.substring(0, 100)}`);
    }
    throw err;
  }
}

export const api = {
  // Games
  getGames: async () => fetchJson(`${API_BASE}/games`),
  getAdminGames: async () => fetchJson(`${API_BASE}/games/admin`, { headers: getAuthHeader() }),
  getGame: async (id: string) => fetchJson(`${API_BASE}/games/${id}`),
  createGame: async (data: any) => fetchJson(`${API_BASE}/games`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data)
  }),
  updateGame: async (id: string, data: any) => fetchJson(`${API_BASE}/games/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data)
  }),
  deleteGame: async (id: string) => fetchJson(`${API_BASE}/games/${id}`, {
    method: 'DELETE', headers: getAuthHeader()
  }),
  rateGame: async (id: string, rating: number) => fetchJson(`${API_BASE}/games/${id}/rate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating })
  }),
  
  // Auth
  login: async (email: string, password: string) => fetchJson(`${API_BASE}/admin/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
  }),
  
  // Ads
  getAdSettings: async () => fetchJson(`${API_BASE}/ads/settings`),
  updateAdSettings: async (data: any) => fetchJson(`${API_BASE}/ads/settings`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data)
  }),
};
