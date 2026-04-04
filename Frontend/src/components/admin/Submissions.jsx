import React, { useState } from "react";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";

export function Submissions() {
  const [search, setSearch] = useState("");
  const [field, setField] = useState("Provided");
  const [selected, setSelected] = useState([]);
  const [hover, setHover] = useState(null);

  const subs = [
    { id: 1, user: "0xdeadbeef", challenge: "ret2win", type: "correct", provided: "CTF{r3t_2_w1n}", date: "2025-04-01 14:32:01" },
    { id: 2, user: "n00bsl4yer", challenge: "SQL Injection 101", type: "correct", provided: "CTF{sql_1nj3ct10n}", date: "2025-04-01 14:45:12" },
    { id: 3, user: "pwn_master", challenge: "ret2win", type: "incorrect", provided: "CTF{wrong_flag}", date: "2025-04-01 15:01:33" },
    { id: 4, user: "r00tk1t", challenge: "RSA Basics", type: "incorrect", provided: "CTF{not_the_flag}", date: "2025-04-01 15:22:47" },
    { id: 5, user: "flag_hunter", challenge: "Memory Dump", type: "correct", provided: "CTF{m3m_dump_m4st3r}", date: "2025-04-01 16:05:09" },
  ];

  const filtered = subs.filter(s =>
    s.provided.toLowerCase().includes(search.toLowerCase()) ||
    s.user.toLowerCase().includes(search.toLowerCase()) ||
    s.challenge.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(s => s.id));

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}><Icon name="terminal" size={22} color="#00ff88" /> SUBMISSIONS</div>
        <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>// all flag submission attempts</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <select style={{ ...S.select, width: 140 }} value={field} onChange={e => setField(e.target.value)}>
          {["Provided", "User", "Challenge", "Type"].map(f => <option key={f}>{f}</option>)}
        </select>
        <div style={{ flex: 1, position: "relative" }}>
          <input style={{ ...S.input, paddingLeft: 36 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for matching submission..." />
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={13} color="#4a5568" />
          </div>
        </div>
        <button style={{ ...S.btnPrimary, padding: "9px 16px" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
          <Icon name="search" size={13} color="#00ff88" />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 10 }}>
        <button style={S.btnIcon}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,136,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,255,136,0.05)"}>
          <Icon name="flag" size={14} color="#00ff88" />
        </button>
        <button style={S.btnIconDanger}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,56,100,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,56,100,0.05)"}>
          <Icon name="trash" size={14} color="#ff3864" />
        </button>
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: 40 }}><input type="checkbox" style={S.checkbox} checked={selected.length === filtered.length} onChange={toggleAll} /></th>
              {["ID", "USER", "CHALLENGE", "TYPE", "PROVIDED", "DATE"].map(h => (
                <th key={h} style={S.th}><div style={{ display: "flex", alignItems: "center", gap: 5 }}>{h}<Icon name="sort" size={9} color="#4a5568" /></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub, i) => (
              <tr key={sub.id}
                style={{ background: hover === i ? "rgba(0,255,136,0.04)" : selected.includes(sub.id) ? "rgba(0,255,136,0.03)" : "transparent", transition: "background 0.15s" }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <td style={S.td}><input type="checkbox" style={S.checkbox} checked={selected.includes(sub.id)} onChange={() => toggle(sub.id)} /></td>
                <td style={{ ...S.td, color: "#4a5568" }}>{sub.id}</td>
                <td style={{ ...S.td, color: "#00e5ff" }}>{sub.user}</td>
                <td style={{ ...S.td, color: "#8892a4" }}>{sub.challenge}</td>
                <td style={S.td}>
                  <span style={sub.type === "correct" ? S.badgeVerified : S.badgeWrong}>{sub.type}</span>
                </td>
                <td style={{ ...S.td, fontFamily: "'JetBrains Mono', monospace", color: sub.type === "correct" ? "#00ff88" : "#ff3864", fontSize: 11 }}>{sub.provided}</td>
                <td style={{ ...S.td, color: "#4a5568", fontSize: 11 }}>{sub.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Submissions;
