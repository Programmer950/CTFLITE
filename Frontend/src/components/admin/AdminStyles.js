export const S = {
  // Layout
  root: {
    position: "fixed", inset: 0,
    background: "#050508",
    color: "#e2e8f4",
    fontFamily: "'Rajdhani', sans-serif",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
  },
  // Topbar
  topbar: {
    position: "relative", zIndex: 100,
    display: "flex", alignItems: "center",
    height: 52,
    background: "rgba(10,10,20,0.95)",
    borderBottom: "1px solid rgba(0,255,136,0.15)",
    backdropFilter: "blur(16px)",
    padding: "0 20px",
    gap: 8,
    flexShrink: 0,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "'Orbitron', monospace",
    fontSize: 18, fontWeight: 900,
    color: "#00ff88",
    textShadow: "0 0 20px rgba(0,255,136,0.6)",
    marginRight: 24,
    letterSpacing: 1,
    flexShrink: 0,
  },
  navSep: { width: 1, height: 22, background: "rgba(255,255,255,0.08)", margin: "0 6px" },
  // Body
  body: { flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 1 },
  // Main content
  main: { flex: 1, overflow: "auto", padding: "32px 40px" },
  // Page header
  pageHeader: {
    marginBottom: 32,
    paddingBottom: 20,
    borderBottom: "1px solid rgba(0,255,136,0.12)",
  },
  pageTitle: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 50,
    fontWeight: 700,
    color: "#00ff88",
    textShadow: "0 0 30px rgba(0,255,136,0.4)",
    letterSpacing: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  // Cards / panels
  card: {
    background: "rgba(10,10,20,0.8)",
    border: "1px solid rgba(30,30,56,0.9)",
    borderRadius: 10,
    padding: "20px 24px",
    backdropFilter: "blur(12px)",
  },
  // Stat boxes
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 },
  statBox: {
    background: "rgba(10,10,20,0.85)",
    border: "1px solid rgba(30,30,56,1)",
    borderRadius: 10, padding: "18px 22px",
    display: "flex", flexDirection: "column", gap: 6,
    position: "relative", overflow: "hidden",
    transition: "border-color 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  // Table
  tableWrap: {
    background: "rgba(10,10,20,0.8)",
    border: "1px solid rgba(30,30,56,0.9)",
    borderRadius: 10, overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 16px",
    background: "rgba(0,255,136,0.06)",
    borderBottom: "1px solid rgba(0,255,136,0.12)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, fontWeight: 500,
    color: "#00ff88", letterSpacing: 1.5,
    textTransform: "uppercase", textAlign: "left",
    userSelect: "none", cursor: "pointer",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(30,30,56,0.7)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, color: "#e2e8f4",
  },
  // Input
  input: {
    background: "rgba(10,10,20,0.9)",
    border: "1px solid rgba(45,45,82,0.9)",
    borderRadius: 6, padding: "9px 14px",
    color: "#e2e8f4", fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    width: "100%", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  textarea: {
    background: "rgba(10,10,20,0.9)",
    border: "1px solid rgba(45,45,82,0.9)",
    borderRadius: 6, padding: "10px 14px",
    color: "#e2e8f4", fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    width: "100%", outline: "none", resize: "vertical",
    minHeight: 120,
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  select: {
    background: "rgba(10,10,20,0.9)",
    border: "1px solid rgba(45,45,82,0.9)",
    borderRadius: 6, padding: "9px 14px",
    color: "#e2e8f4", fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none", cursor: "pointer",
    transition: "border-color 0.2s",
  },
  label: {
    display: "block", fontSize: 12, fontWeight: 600,
    color: "#00ff88", letterSpacing: 1.2,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 6, textTransform: "uppercase",
  },
  hint: { fontSize: 11, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 },
  // Buttons
  btnPrimary: {
    background: "transparent",
    border: "1px solid #00ff88",
    color: "#00ff88", borderRadius: 6,
    padding: "9px 20px", fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500, letterSpacing: 1,
    cursor: "pointer", transition: "all 0.2s",
    display: "inline-flex", alignItems: "center", gap: 6,
  },
  btnDanger: {
    background: "transparent",
    border: "1px solid #ff3864",
    color: "#ff3864", borderRadius: 6,
    padding: "9px 20px", fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500, letterSpacing: 1,
    cursor: "pointer", transition: "all 0.2s",
    display: "inline-flex", alignItems: "center", gap: 6,
  },
  btnIcon: {
    background: "rgba(0,255,136,0.05)",
    border: "1px solid rgba(0,255,136,0.2)",
    color: "#00ff88", borderRadius: 6,
    padding: "7px 10px", cursor: "pointer",
    transition: "all 0.2s",
    display: "inline-flex", alignItems: "center",
  },
  btnIconDanger: {
    background: "rgba(255,56,100,0.05)",
    border: "1px solid rgba(255,56,100,0.2)",
    color: "#ff3864", borderRadius: 6,
    padding: "7px 10px", cursor: "pointer",
    transition: "all 0.2s",
    display: "inline-flex", alignItems: "center",
  },
  // Badges
  badgeAdmin: {
    background: "rgba(157,78,221,0.2)", color: "#9d4edd",
    border: "1px solid rgba(157,78,221,0.4)",
    borderRadius: 4, padding: "2px 8px",
    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
  },
  badgeHidden: {
    background: "rgba(255,56,100,0.15)", color: "#ff3864",
    border: "1px solid rgba(255,56,100,0.35)",
    borderRadius: 4, padding: "2px 8px",
    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
  },
  badgeVerified: {
    background: "rgba(0,255,136,0.12)", color: "#00ff88",
    border: "1px solid rgba(0,255,136,0.3)",
    borderRadius: 4, padding: "2px 8px",
    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
  },
  badgeSolved: {
    background: "rgba(0,229,255,0.12)", color: "#00e5ff",
    border: "1px solid rgba(0,229,255,0.3)",
    borderRadius: 4, padding: "2px 8px",
    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
  },
  badgeWrong: {
    background: "rgba(255,56,100,0.12)", color: "#ff3864",
    border: "1px solid rgba(255,56,100,0.3)",
    borderRadius: 4, padding: "2px 8px",
    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
  },
  // Scanline
  scanline: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
  },
  // Checkbox
  checkbox: {
    width: 14, height: 14, accentColor: "#00ff88",
    cursor: "pointer",
  },
  // Config sidebar
  configSidebar: {
    width: 220, background: "rgba(10,10,20,0.7)",
    borderRight: "1px solid rgba(30,30,56,0.9)",
    padding: "20px 0", overflowY: "auto", flexShrink: 0,
  },
  // Section label
  sectionLabel: {
    fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace",
    color: "#4a5568", textTransform: "uppercase", padding: "12px 16px 6px",
    fontWeight: 600,
  },
  // Bar chart bar
  chartBar: {
    height: 24, borderRadius: 3, display: "flex", alignItems: "center",
    paddingLeft: 8, fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace", color: "#fff",
  },
  // Radio / check row
  radioRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" },
};

export default S;
