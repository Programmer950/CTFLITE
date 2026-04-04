import React, { useState } from "react";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";

export function Scoreboard() {
  const [selected, setSelected] = useState([]);
  const [hover, setHover] = useState(null);

  const data = [
    { id: 1, place: 1, user: "0xdeadbeef", bracket: "Open", score: 2400, visible: true },
    { id: 2, place: 2, user: "n00bsl4yer", bracket: "Open", score: 1800, visible: true },
    { id: 3, place: 3, user: "pwn_master", bracket: "Open", score: 1440, visible: false },
    { id: 4, place: 4, user: "r00tk1t", bracket: "Open", score: 1200, visible: true },
    { id: 5, place: 5, user: "flag_hunter", bracket: "Student", score: 980, visible: true },
  ];

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === data.length ? [] : data.map(d => d.id));

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}><Icon name="trophy" size={22} color="#00ff88" /> SCOREBOARD</div>
        <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>// live ranking management</div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button style={S.btnIcon}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,136,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,255,136,0.05)"}>
          <Icon name="eye" size={14} color="#00ff88" />
        </button>
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: 40 }}><input type="checkbox" style={S.checkbox} checked={selected.length === data.length} onChange={toggleAll} /></th>
              {["PLACE", "USER", "BRACKET", "SCORE", "VISIBILITY"].map(h => (
                <th key={h} style={S.th}><div style={{ display: "flex", alignItems: "center", gap: 5 }}>{h}<Icon name="sort" size={9} color="#4a5568" /></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id}
                style={{ background: hover === i ? "rgba(0,255,136,0.04)" : selected.includes(row.id) ? "rgba(0,255,136,0.03)" : "transparent", transition: "background 0.15s" }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <td style={S.td}><input type="checkbox" style={S.checkbox} checked={selected.includes(row.id)} onChange={() => toggle(row.id)} /></td>
                <td style={{ ...S.td, color: row.place <= 3 ? "#ffd60a" : "#8892a4", fontWeight: row.place <= 3 ? 700 : 400 }}>
                  {row.place === 1 ? "🥇" : row.place === 2 ? "🥈" : row.place === 3 ? "🥉" : ""} #{row.place}
                </td>
                <td style={{ ...S.td, color: "#00e5ff" }}>{row.user}</td>
                <td style={{ ...S.td, color: "#4a5568" }}>{row.bracket}</td>
                <td style={{ ...S.td, color: "#00ff88", fontWeight: 600 }}>{row.score.toLocaleString()}</td>
                <td style={S.td}>
                  <span style={row.visible ? S.badgeVerified : S.badgeHidden}>{row.visible ? "visible" : "hidden"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Scoreboard;
