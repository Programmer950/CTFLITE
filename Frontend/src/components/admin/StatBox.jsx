import React, { useState } from "react";
import { Icon } from "./Icon";
import { S } from "./AdminStyles";

export function StatBox({ value, label, color, icon, glow }) {
  const [hov, setHov] = useState(false);
  const c = color || "#00ff88";
  const g = glow || "rgba(0,255,136,0.25)";
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...S.statBox,
        borderColor: hov ? c.replace(")", ",0.4)").replace("rgb", "rgba") : "rgba(30,30,56,1)",
        boxShadow: hov ? `0 0 24px ${g}, inset 0 0 12px ${g}` : "none",
      }}
    >
      <div style={{ position: "absolute", top: 14, right: 14, opacity: 0.3 }}>
        <Icon name={icon} size={22} color={c} />
      </div>
      <div style={{ fontSize: 11, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Orbitron', monospace", color: c, textShadow: `0 0 20px ${g}`, lineHeight: 1.1 }}>{value}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${c}, transparent)`, opacity: hov ? 0.6 : 0.15 }} />
    </div>
  );
}

export default StatBox;
