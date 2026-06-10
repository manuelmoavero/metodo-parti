// ui/SlidePanel.js - overlay slide-up riusabile, base dei panels/

// ============================================================
// SLIDE-UP PANEL — shared shell for Pilastri and Prontuario
// ============================================================

function SlidePanel({ title, subtitle, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(58, 40, 24, 0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 100,
        animation: "fadeIn 200ms ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          margin: "0 auto",
          background: "var(--bg-page)",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          maxHeight: "85vh",
          overflowY: "auto",
          animation: "slideUp 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: subtitle ? "4px" : "16px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontStyle: "italic",
              color: "var(--ink-strong)",
            }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-soft)",
            }}
          >
            <X size={20} />
          </button>
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "11px",
              color: "var(--ink-soft)",
              marginBottom: "14px",
              fontStyle: "italic",
            }}
          >
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

