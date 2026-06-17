export const getBaseUrl = () => {
  let url = null;

  // 1. Check custom URL override
  const customUrl = localStorage.getItem('custom_api_url');
  if (customUrl) {
    url = customUrl.trim();
  } 
  // 2. Check Vite env variables
  else if (import.meta.env && import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL.trim();
  } 
  // 3. Fallback to origin pathing for production
  else if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      url = `${window.location.origin}/api`;
    }
  }

  if (!url) return null;

  // Auto-resolve missing '/api' suffix if omitted
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.endsWith('/') ? `${url}api` : `${url}/api`;
  }

  // Auto-resolve missing absolute protocol (fixes browser prepending origin hostname errors)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  return url;
};

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  get headers() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async _request(endpoint, options = {}) {
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      throw new Error("API Connection Configuration Required. Localhost fallback is disabled.");
    }
    
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (_) {
      throw new Error(`Failed to parse API response. Raw response: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.statusCode || response.status}`);
    }

    return data;
  }

  async signup(payload) {
    const data = await this._request('/users/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(payload) {
    const data = await this._request('/users/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async personalize(userId, payload) {
    return this._request(`/users/${userId}/personalize`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async fetchCognitiveState(userId) {
    const data = await this._request(`/users/${userId}/cognitive-state`);
    return data.cognitive_state || [];
  }

  async fetchUserProfile(userId) {
    return this._request(`/users/${userId}`);
  }

  async fetchCurriculum(domain, userId = null) {
    const query = userId ? `?user_id=${userId}` : '';
    return this._request(`/curriculum/${domain}${query}`);
  }

  async fetchInitialQuestions() {
    return this._request('/questions/initial');
  }

  async submitAnswer(payload) {
    return this._request('/questions/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async fetchPracticeQuestions(userId) {
    return this._request(`/questions/practice?user_id=${userId}`);
  }

  async sendTelemetry(payload) {
    return this._request('/telemetry', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiService();
