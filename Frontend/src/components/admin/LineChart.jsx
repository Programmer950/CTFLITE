import React from "react";

export function LineChart({ title, data, color = "#00ff88" }) {
  const W = 560, H = 160, pad = 30;
  const maxV = Math.max(...data.map(d => d.v), 1);
  const pts = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: H - pad - (d.v / maxV) * (H - pad * 2),
    label: d.l,
  }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${path} L${pts[pts.length - 1].x},${H - pad} L${pts[0].x},${H - pad} Z`;
  return (
    <div>
      <div style={{ fontSize: 13, color: "#8892a4", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10, letterSpacing: 1 }}>{title}</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={pad} x2={W - pad} y1={H - pad - t * (H - pad * 2)} y2={H - pad - t * (H - pad * 2)}
            stroke="rgba(30,30,56,0.9)" strokeWidth={1} />
        ))}
        <path d={area} fill="url(#lineGrad)" />
        <path d={path} fill="none" stroke={color} strokeWidth={2} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        ))}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 6} textAnchor="middle" fill="#4a5568" fontSize={9} fontFamily="'JetBrains Mono', monospace">{p.label}</text>
        ))}
      </svg>
    </div>
  );
}

export default LineChart;
