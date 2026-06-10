// panels/LoginPanel.js
// Slide panel per login e registrazione.
// Usa supabaseAuth da data/supabase.js.
// onSuccess(user) viene chiamato dopo login o signup riuscito.

function LoginPanel({ onClose, onSuccess }) {
  const [tab, setTab]         = useState("login");   // "login" | "signup"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Inserisci email e password.");
      return;
    }
    setLoading(true);
    try {
      let data;
      if (tab === "login") {
        data = await supabaseAuth.signIn(email.trim(), password);
      } else {
        data = await supabaseAuth.signUp(email.trim(), password);
      }
      const user = data.user || await supabaseAuth.getUser();
      onSuccess(user);
      onClose();
    } catch (e) {
      setError(e.message || "Errore di connessione.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid rgba(138, 90, 44, 0.25)",
    borderRadius: "8px",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    background: "rgba(255,255,255,0.7)",
    color: "var(--ink)",
    outline: "none",
    marginBottom: "10px",
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "7px 0",
    border: "none",
    borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: active ? 700 : 400,
    color: active ? "var(--accent)" : "var(--ink-soft)",
  });

  return (
    <SlidePanel
      title="Sincronizzazione"
      subtitle="Accedi per salvare i tuoi dati su più dispositivi."
      onClose={onClose}
    >
      {/* Tab switcher */}
      <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid rgba(138,90,44,0.12)" }}>
        <button style={tabStyle(tab === "login")}  onClick={() => { setTab("login");  setError(null); }}>
          Accedi
        </button>
        <button style={tabStyle(tab === "signup")} onClick={() => { setTab("signup"); setError(null); }}>
          Registrati
        </button>
      </div>

      {/* Form */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={inputStyle}
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handle()}
        style={{ ...inputStyle, marginBottom: "16px" }}
        autoComplete={tab === "login" ? "current-password" : "new-password"}
      />

      {error && (
        <div style={{
          fontSize: "12px",
          color: "#b03832",
          marginBottom: "12px",
          padding: "8px 10px",
          background: "rgba(176,56,50,0.07)",
          borderRadius: "6px",
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handle}
        disabled={loading}
        style={{
          width: "100%",
          padding: "11px",
          background: loading ? "rgba(138,90,44,0.3)" : "var(--accent)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "..." : tab === "login" ? "Accedi" : "Registrati"}
      </button>

      {tab === "signup" && (
        <div style={{
          marginTop: "14px",
          fontSize: "11px",
          color: "var(--ink-soft)",
          fontStyle: "italic",
          lineHeight: 1.5,
          textAlign: "center",
        }}>
          I tuoi dati restano privati e visibili solo a te.
        </div>
      )}
    </SlidePanel>
  );
}
