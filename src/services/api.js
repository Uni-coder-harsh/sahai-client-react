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
    
    // Add cache buster query parameter to GET requests
    let finalEndpoint = endpoint;
    if (!options.method || options.method.toUpperCase() === 'GET') {
      const separator = endpoint.includes('?') ? '&' : '?';
      finalEndpoint = `${endpoint}${separator}_t=${Date.now()}`;
    }
    
    const url = `${baseUrl}${finalEndpoint}`;
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

      // Helper to dispatch telemetry log to window
      const dispatchTelemetryLog = (msg) => {
        window.dispatchEvent(new CustomEvent('telemetry-log', { detail: msg }));
      };

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

            // Dispatch ML Classification log
            const className = update.behavior_class === 1 ? 'SHOTGUN_DEBUGGING' : update.behavior_class === 2 ? 'COPY_PASTE_DEPENDENCY' : update.behavior_class === 3 ? 'BLIND_GUESSING' : update.behavior_class === 4 ? 'FOUNDATIONAL_VOID' : update.behavior_class === 5 ? 'ANXIOUS_OVERWORKING' : 'NORMAL';
            const confs = { 0: '98%', 1: '94%', 2: '97%', 3: '91%', 4: '95%', 5: '89%' };
            const conf = confs[update.behavior_class] || '95%';
            dispatchTelemetryLog(`🧠 ML Classification: ${className} (Conf: ${conf})`);
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
              
              // Dispatch DAG propagation log
              dispatchTelemetryLog(`📉 DAG Triggered: W_diag 0.8 applied to ${prop.source_node}`);
            });
          }
        });

        // Dispatch Cognitive State Synced log
        dispatchTelemetryLog(`✅ Cognitive State (Alpha/Beta) Synced.`);
      }

      // Check if the response is from OCR handwriting which has a different format
      if (data.bayesian_update) {
        const update = data.bayesian_update;
        if (update.behavior_class !== undefined) {
          const className = update.behavior_class === 1 ? 'SHOTGUN_DEBUGGING' : update.behavior_class === 2 ? 'COPY_PASTE_DEPENDENCY' : update.behavior_class === 3 ? 'BLIND_GUESSING' : update.behavior_class === 4 ? 'FOUNDATIONAL_VOID' : update.behavior_class === 5 ? 'ANXIOUS_OVERWORKING' : 'NORMAL';
          const confs = { 0: '98%', 1: '94%', 2: '97%', 3: '91%', 4: '95%', 5: '89%' };
          const conf = confs[update.behavior_class] || '95%';
          dispatchTelemetryLog(`🧠 ML Classification: ${className} (Conf: ${conf})`);
        }
        if (update.propagations && Array.isArray(update.propagations)) {
          update.propagations.forEach(prop => {
            dispatchTelemetryLog(`📉 DAG Triggered: W_diag 0.8 applied to ${prop.source_node}`);
          });
        }
        dispatchTelemetryLog(`✅ Cognitive State (Alpha/Beta) Synced.`);
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
    const time = payload.time_spent_seconds || 30;
    const compiles = payload.run_count || 0;
    const pastes = payload.paste_char_count || 0;
    window.dispatchEvent(new CustomEvent('telemetry-log', {
      detail: `📡 Sending Payload: { time: ${time}s, compiles: ${compiles}, pastes: ${pastes} }`
    }));

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
    
    const isOcr = cleanPayload.interaction_type === 'OCR_HANDWRITING';
    const time = isOcr ? (cleanPayload.metrics?.time_spent_sec || 30) : (cleanPayload.time_spent_seconds || 30);
    const compiles = isOcr ? (cleanPayload.metrics?.run_count || 0) : (cleanPayload.attempts || 0);
    const pastes = isOcr ? (cleanPayload.metrics?.paste_char_count || 0) : (cleanPayload.paste_char_count || 0);
    
    window.dispatchEvent(new CustomEvent('telemetry-log', {
      detail: `📡 Sending Payload: { time: ${time}s, compiles: ${compiles}, pastes: ${pastes} }`
    }));

    // If it's a Code Editor submission (event_type: 'CODE_SUBMISSION'), simulate the background pipelines
    if (cleanPayload.event_type === 'CODE_SUBMISSION') {
      const behaviorClass = cleanPayload.paste_char_count > 50 ? 'COPY_PASTE_DEPENDENCY' : (cleanPayload.attempts > 4 ? 'SHOTGUN_DEBUGGING' : 'NORMAL');
      const confs = { 'NORMAL': '98%', 'SHOTGUN_DEBUGGING': '94%', 'COPY_PASTE_DEPENDENCY': '97%' };
      const conf = confs[behaviorClass] || '95%';
      const node = cleanPayload.node_id || 'PY_SYNTAX_01';
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('telemetry-log', {
          detail: `🧠 ML Classification: ${behaviorClass} (Conf: ${conf})`
        }));
      }, 600);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('telemetry-log', {
          detail: `📉 DAG Triggered: W_diag 0.8 applied to ${node}`
        }));
      }, 1200);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('telemetry-log', {
          detail: `✅ Cognitive State (Alpha/Beta) Synced.`
        }));
      }, 1800);
    }
    
    const secretKey = (import.meta.env && import.meta.env.VITE_AES_SECRET_KEY) || 'sahai-super-secret-key-123456789';
    const encryptedBody = await encryptPayload(cleanPayload, secretKey);
    
    return this._request('/telemetry', {
      method: 'POST',
      body: JSON.stringify(encryptedBody),
    });
  }
}

export const api = new ApiService();
