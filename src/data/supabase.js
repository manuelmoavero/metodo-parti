// data/supabase.js
// Client Supabase minimale (senza SDK: fetch nativo + REST API).
// Espone: supabaseAuth (login/signup/logout/onAuthStateChange)
//         e le funzioni di I/O per day_data e flag_data.
//
// Perché senza SDK: l'app non usa bundler; caricare @supabase/supabase-js
// via CDN aggiunge ~250kb e richiede ES modules. Il REST API di Supabase
// è stabile e sufficiente per le operazioni che usiamo.

const SUPA_URL  = "https://ojhqieknxhsrxyvdowja.supabase.co";
const SUPA_KEY  = "sb_publishable_W3axOEhDUPPdMZ1tKXtCug_l-35rcw4";

// ── Token in memoria (non in localStorage per sicurezza) ──────────────────
let _accessToken  = null;
let _refreshToken = null;
let _authListeners = [];

function _notifyListeners(user) {
  _authListeners.forEach(fn => fn(user));
}

// Restituisce gli header comuni per le chiamate autenticate.
function _headers(extra = {}) {
  const h = {
    "Content-Type": "application/json",
    "apikey": SUPA_KEY,
    ...extra,
  };
  if (_accessToken) h["Authorization"] = `Bearer ${_accessToken}`;
  return h;
}

// ── Auth ──────────────────────────────────────────────────────────────────
const supabaseAuth = {

  // Registrazione nuova utente
  async signUp(email, password) {
    const res = await fetch(`${SUPA_URL}/auth/v1/signup`, {
      method: "POST",
      headers: _headers(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.error_description || "Errore registrazione");
    if (data.access_token) _setSession(data);
    return data;
  },

  // Login
  async signIn(email, password) {
    const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: _headers(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.error_description || "Credenziali non valide");
    _setSession(data);
    return data;
  },

  // Logout
  async signOut() {
    if (_accessToken) {
      await fetch(`${SUPA_URL}/auth/v1/logout`, {
        method: "POST",
        headers: _headers(),
      }).catch(() => {});
    }
    _clearSession();
  },

  // Recupera la sessione salvata (chiamato al mount di App)
  async restoreSession() {
    const stored = localStorage.getItem("parti_auth");
    if (!stored) return null;
    try {
      const { accessToken, refreshToken } = JSON.parse(stored);
      _accessToken  = accessToken;
      _refreshToken = refreshToken;
      // Verifica che il token sia ancora valido
      const user = await supabaseAuth.getUser();
      if (user) {
        _notifyListeners(user);
        return user;
      }
    } catch (e) {}
    _clearSession();
    return null;
  },

  // Ritorna l'utente corrente dal server
  async getUser() {
    if (!_accessToken) return null;
    try {
      const res = await fetch(`${SUPA_URL}/auth/v1/user`, {
        headers: _headers(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Registra un listener per i cambiamenti di sessione
  onAuthStateChange(fn) {
    _authListeners.push(fn);
    return () => { _authListeners = _authListeners.filter(l => l !== fn); };
  },

  getCurrentUserId() {
    return _accessToken ? _parseJwtUserId(_accessToken) : null;
  },
};

// ── Helpers sessione ──────────────────────────────────────────────────────
function _setSession(data) {
  _accessToken  = data.access_token;
  _refreshToken = data.refresh_token;
  try {
    localStorage.setItem("parti_auth", JSON.stringify({
      accessToken:  _accessToken,
      refreshToken: _refreshToken,
    }));
  } catch (e) {}
  const user = data.user || { id: _parseJwtUserId(_accessToken), email: data.email };
  _notifyListeners(user);
}

function _clearSession() {
  _accessToken  = null;
  _refreshToken = null;
  try { localStorage.removeItem("parti_auth"); } catch (e) {}
  _notifyListeners(null);
}

function _parseJwtUserId(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch (e) {
    return null;
  }
}

// ── I/O dati giornalieri ──────────────────────────────────────────────────

// Carica tutti i day_data e flag_data dell'utente loggato.
// Restituisce { daysData: {}, flagsData: {} } nel formato già usato da App.
async function loadAllFromSupabase() {
  const userId = supabaseAuth.getCurrentUserId();
  if (!userId) return null;

  const [dayRes, flagRes] = await Promise.all([
    fetch(`${SUPA_URL}/rest/v1/day_data?user_id=eq.${userId}&select=date_key,data`, {
      headers: _headers({ "Accept": "application/json" }),
    }),
    fetch(`${SUPA_URL}/rest/v1/flag_data?user_id=eq.${userId}&select=date_key,data`, {
      headers: _headers({ "Accept": "application/json" }),
    }),
  ]);

  if (!dayRes.ok || !flagRes.ok) {
    console.error("[supa] load FALLITO", dayRes.status, flagRes.status);
    return null;
  }

  const dayRows  = await dayRes.json();
  const flagRows = await flagRes.json();
  console.log("[supa] load OK:", dayRows.length, "giorni,", flagRows.length, "flag");

  const daysData  = {};
  const flagsData = {};
  dayRows.forEach(r  => { daysData[r.date_key]  = r.data; });
  flagRows.forEach(r => { flagsData[r.date_key] = r.data; });

  return { daysData, flagsData };
}

// Salva (upsert) un singolo giorno su day_data.
async function saveDayToSupabase(dateKey, data) {
  const userId = supabaseAuth.getCurrentUserId();
  if (!userId) { console.warn("[supa] saveDay: nessun userId"); return; }
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/day_data`, {
      method: "POST",
      headers: _headers({
        "Prefer": "resolution=merge-duplicates",
      }),
      body: JSON.stringify({ user_id: userId, date_key: dateKey, data, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[supa] saveDay FALLITO", res.status, body);
    } else {
      console.log("[supa] saveDay OK", dateKey);
    }
  } catch (e) {
    console.error("[supa] saveDay ERRORE rete", e);
  }
}

// Salva (upsert) i flag di un singolo giorno su flag_data.
async function saveFlagToSupabase(dateKey, data) {
  const userId = supabaseAuth.getCurrentUserId();
  if (!userId) return;
  await fetch(`${SUPA_URL}/rest/v1/flag_data`, {
    method: "POST",
    headers: _headers({
      "Prefer": "resolution=merge-duplicates",
    }),
    body: JSON.stringify({ user_id: userId, date_key: dateKey, data, updated_at: new Date().toISOString() }),
  }).catch(() => {});
}

// Cancella il giorno corrente da day_data (usato da resetToday).
async function deleteDayFromSupabase(dateKey) {
  const userId = supabaseAuth.getCurrentUserId();
  if (!userId) return;
  await fetch(`${SUPA_URL}/rest/v1/day_data?user_id=eq.${userId}&date_key=eq.${dateKey}`, {
    method: "DELETE",
    headers: _headers(),
  }).catch(() => {});
}

// ── Storage locale per scope ──────────────────────────────────────────────
// Due spazi dati distinti che NON si mescolano mai:
//   - anonimo:  parti_day:<date>            / parti_flag:<date>
//   - account:  parti_acct:<uid>:day:<date> / parti_acct:<uid>:flag:<date>
// Lo scope account è la cache locale dei dati remoti, per funzionamento offline.
const partiStore = {

  // Prefissi per uno scope. userId === null => scope anonimo.
  _prefixes(userId) {
    if (userId) {
      return {
        day:  `parti_acct:${userId}:day:`,
        flag: `parti_acct:${userId}:flag:`,
      };
    }
    return { day: "parti_day:", flag: "parti_flag:" };
  },

  // Legge { daysData, flagsData } dallo scope indicato.
  load(userId) {
    const { day, flag } = this._prefixes(userId);
    const daysData  = {};
    const flagsData = {};
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(day)) {
        try { daysData[k.slice(day.length)] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
      } else if (k.startsWith(flag)) {
        try { flagsData[k.slice(flag.length)] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
      }
    });
    return { daysData, flagsData };
  },

  // Scrive un singolo giorno nello scope.
  setDay(userId, dateKey, data) {
    const { day } = this._prefixes(userId);
    try { localStorage.setItem(`${day}${dateKey}`, JSON.stringify(data)); } catch (e) {}
  },

  // Scrive i flag di un giorno nello scope.
  setFlag(userId, dateKey, data) {
    const { flag } = this._prefixes(userId);
    try { localStorage.setItem(`${flag}${dateKey}`, JSON.stringify(data)); } catch (e) {}
  },

  // Rimuove un giorno dallo scope.
  removeDay(userId, dateKey) {
    const { day } = this._prefixes(userId);
    try { localStorage.removeItem(`${day}${dateKey}`); } catch (e) {}
  },

  // Svuota completamente uno scope (usato prima di un import).
  clear(userId) {
    const { day, flag } = this._prefixes(userId);
    Object.keys(localStorage)
      .filter((k) => k.startsWith(day) || k.startsWith(flag))
      .forEach((k) => localStorage.removeItem(k));
  },

  // Rimpiazza l'intero contenuto di uno scope con i dati passati.
  replace(userId, daysData, flagsData) {
    this.clear(userId);
    Object.entries(daysData).forEach(([k, v])  => this.setDay(userId, k, v));
    Object.entries(flagsData).forEach(([k, v]) => this.setFlag(userId, k, v));
  },
};
