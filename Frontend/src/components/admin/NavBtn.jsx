import React, { useState } from "react";
import { Icon } from "./Icon";

export function NavBtn({ icon, label, active, onClick, hasDropdown }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 6,
        background: active ? "rgba(0,255,136,0.1)" : hov ? "rgba(0,255,136,0.06)" : "transparent",
        border: active ? "1px solid rgba(0,255,136,0.35)" : "1px solid transparent",
        color: active ? "#00ff88" : hov ? "#e2e8f4" : "#8892a4",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12, letterSpacing: 0.5, cursor: "pointer",
        transition: "all 0.18s",
        textShadow: active ? "0 0 12px rgba(0,255,136,0.5)" : "none",
      }}
    >
      <Icon name={icon} size={13} color={active ? "#00ff88" : hov ? "#e2e8f4" : "#8892a4"} />
      {label}
      {hasDropdown && <Icon name="chevronDown" size={11} color={active ? "#00ff88" : "#4a5568"} />}
    </button>
  );
}

export default NavBtn;
