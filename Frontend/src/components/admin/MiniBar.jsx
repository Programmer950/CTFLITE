import React from "react";

export function MiniBar({ label, val, max, color }) {
  const pct = Math.round((val / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#8892a4" }}>
        <span>{label}</span><span style={{ color }}>{val}</span>
      </div>
      <div style={{ height: 6, background: "rgba(30,30,56,0.9)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 3, transition: "width 0.8s ease", boxShadow: `0 0 6px ${color}88` }} />
      </div>
    </div>
  );
}

export default MiniBar;
