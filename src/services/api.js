import { encryptPayload } from '../utils/crypto';

export const getBaseUrl = () => {
  let apiUrl = null;


  // 1. Check custom URL override
  const customUrl = localStorage.getItem('custom_api_url');
  if (customUrl) {
    apiUrl = customUrl.trim();
  } 
  // 2. Check Vite env variables
  else if (import.meta.env && import.meta.env.VITE_API_URL) {
    apiUrl = import.meta.env.VITE_API_URL.trim();
  } 
  // 3. Fallback to origin pathing for production
  else if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      apiUrl = `${window.location.origin}/api`;
    }
  }

  if (!apiUrl) return null;

  // Auto-resolve missing '/api' suffix if omitted
  if (!apiUrl.endsWith('/api') && !apiUrl.endsWith('/api/')) {
    apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
  }

  // Auto-resolve missing absolute protocol (fixes browser prepending origin hostname errors)
  if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
      apiUrl = `http://${apiUrl}`;
    } else {
      apiUrl = `https://${apiUrl}`;
    }
  }

  return apiUrl;
};

export const debugLogs = [];
let logListeners = [];
export const addLogListener = (listener) => {
  logListeners.push(listener);
  return () => {
    logListeners = logListeners.filter(l => l !== listener);
  };
};

export const addDebugLog = (type, message, details = null) => {
  const logEntry = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    type, // 'API_REQUEST' | 'API_RESPONSE' | 'ML_CLASSIFIER' | 'BAYESIAN_UPDATE' | 'DAG_PROPAGATION' | 'SYSTEM'
    message,
    details
  };
  debugLogs.push(logEntry);
  if (debugLogs.length > 200) debugLogs.shift();
  logListeners.forEach(listener => {
    try {
      listener(logEntry, debugLogs);
    } catch (e) {
      console.error(e);
    }
  });
};

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token') || null;
    this.language = localStorage.getItem('app_language') || 'en';
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem('app_language', lang);
  }

  get headers() {
    const headers = {
      'Content-Type': 'application/json',
      'X-App-Language': this.language || 'en'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async _request(endpoint, options = {}) {
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      addDebugLog('SYSTEM', 'Failed API request: Gateway configuration missing');
      throw new Error("API Connection Configuration Required. Localhost fallback is disabled.");
    }
    
    const url = `${baseUrl}${endpoint}`;
    let bodyObj = null;
    if (options.body) {
      try {
        bodyObj = JSON.parse(options.body);
      } catch (_) {
        bodyObj = options.body;
      }
    }
    
    addDebugLog('API_REQUEST', `Initiating HTTP ${options.method || 'GET'} request to ${endpoint}`, { url, body: bodyObj });

    try {
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
        addDebugLog('SYSTEM', `HTTP response parse error on ${endpoint}`, { rawResponse: text });
        throw new Error(`Failed to parse API response. Raw response: ${text}`);
      }

      addDebugLog('API_RESPONSE', `HTTP ${response.status} response from ${endpoint}`, data);

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.statusCode || response.status}`);
      }

      // Check if the response contains telemetry updates from the Python engine
      if (data.telemetry_updates && Array.isArray(data.telemetry_updates)) {
        data.telemetry_updates.forEach(update => {
          if (update.behavior_class !== undefined) {
            const behaviorLabels = {
              0: 'Normal behavior classified by Random Forest model.',
              1: 'Shotgun Debugging detected! Penalizing learning rate to 0.5.',
              2: 'Copy-Paste dependency detected! Penalizing learning rate to 0.1.'
            };
            addDebugLog('ML_CLASSIFIER', `Random Forest behavior classification: Class ${update.behavior_class}`, {
              label: behaviorLabels[update.behavior_class],
              node_id: update.node_id,
              user_id: update.user_id
            });
          }
          if (update.expected_mastery !== undefined) {
            addDebugLog('BAYESIAN_UPDATE', `Updated concept ${update.node_id}: Expected Mastery E[K] = ${update.expected_mastery.toFixed(4)}`, {
              alpha: update.alpha,
              beta: update.beta,
              mastery: update.expected_mastery
            });
          }
          if (update.misconceptions_updated && Array.isArray(update.misconceptions_updated)) {
            update.misconceptions_updated.forEach(misc => {
              addDebugLog('BAYESIAN_UPDATE', `Misconception triggered on concept ${misc.node_id}: Expected Mastery E[K] = ${misc.expected_mastery.toFixed(4)}`, misc);
            });
          }
          if (update.propagations && Array.isArray(update.propagations)) {
            update.propagations.forEach(prop => {
              addDebugLog('DAG_PROPAGATION', `Propagated updates up DAG: ${prop.target_node} -> parent ${prop.source_node} (Mastery: ${prop.expected_mastery.toFixed(4)})`, prop);
            });
          }
        });
      }

      return data;
    } catch (err) {
      addDebugLog('SYSTEM', `HTTP request failed for ${endpoint}: ${err.message}`, { error: err });
      throw err;
    }
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

  async updateUserProfile(userId, payload) {
    return this._request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async fetchInstitutions() {
    return this._request('/users/institutions/list');
  }

  async fetchCurriculum(domain, userId = null) {
    const query = userId ? `?user_id=${userId}` : '';
    return this._request(`/curriculum/${domain}${query}`);
  }

  async fetchInitialQuestions() {
    return this._request('/questions/initial');
  }

  async fetchAllQuestions(userId) {
    return this._request(`/questions/all?user_id=${userId}`);
  }

  async fetchQuestionDetails(questionId) {
    return this._request(`/questions/${questionId}`);
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

  async fetchAttemptHistory(userId) {
    return this._request(`/questions/history?user_id=${userId}`);
  }

  async sendTelemetry(payload) {
    const cleanPayload = { ...payload };
    delete cleanPayload.user_id; // DPDP Compliance: NEVER pass user_id in payload body
    
    const secretKey = (import.meta.env && import.meta.env.VITE_AES_SECRET_KEY) || 'sahai-super-secret-key-123456789';
    const encryptedBody = await encryptPayload(cleanPayload, secretKey);
    
    return this._request('/telemetry', {
      method: 'POST',
      body: JSON.stringify(encryptedBody),
    });
  }
}

export const api = new ApiService();
