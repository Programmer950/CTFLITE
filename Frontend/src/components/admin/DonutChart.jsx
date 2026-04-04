import React from "react";

export function DonutChart({ segments, title }) {
  const r = 54, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  let cumPct = 0;
  const total = segments.reduce((s, g) => s + g.value, 0);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "#8892a4", fontFamily: "'JetBrains Mono', monospace", marginBottom: 12, letterSpacing: 1 }}>{title}</div>
      <svg width={140} height={140} style={{ overflow: "visible" }}>
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = circumference * pct;
          const offset = circumference * (1 - cumPct);
          cumPct += pct;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={16}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              style={{ filter: `drop-shadow(0 0 4px ${seg.color}88)`, transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={38} fill="rgba(10,10,20,0.9)" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#e2e8f4" fontSize={18} fontFamily="'Orbitron', monospace" fontWeight={700}>{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#4a5568" fontSize={9} fontFamily="'JetBrains Mono', monospace">TOTAL</text>
      </svg>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#8892a4" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonutChart;
