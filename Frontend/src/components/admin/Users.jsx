import React, { useState } from "react";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";

export function Users() {
  const [search, setSearch] = useState("");
  const [field, setField] = useState("Name");
  const [selected, setSelected] = useState([]);
  const [hover, setHover] = useState(null);

  const mockUsers = [
    { id: 1, name: "admin", email: "admin@admin.com", country: "US", admin: true, verified: true, hidden: true, banned: false },
    { id: 2, name: "0xdeadbeef", email: "pwn@hack.io", country: "DE", admin: false, verified: true, hidden: false, banned: false },
    { id: 3, name: "n00bsl4yer", email: "slayer@ctf.net", country: "JP", admin: false, verified: false, hidden: false, banned: false },
    { id: 4, name: "pwn_master", email: "master@overflow.sh", country: "GB", admin: false, verified: true, hidden: false, banned: false },
    { id: 5, name: "suspicious_user", email: "sus@anon.xyz", country: "??", admin: false, verified: false, hidden: false, banned: true },
  ];

  const filtered = mockUsers.filter(u =>
    u[field.toLowerCase()] ? String(u[field.toLowerCase()]).toLowerCase().includes(search.toLowerCase())
      : u.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(u => u.id));

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={S.pageTitle}><Icon name="users" size={22} color="#00ff88" /> USERS</div>
          <button style={{ ...S.btnIcon, borderRadius: "50%", padding: "6px" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.3)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <Icon name="plus" size={14} color="#00ff88" />
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>// registered participant management</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <select style={{ ...S.select, width: 140 }} value={field} onChange={e => setField(e.target.value)}>
          {["Name", "Email", "Country"].map(f => <option key={f}>{f}</option>)}
        </select>
        <div style={{ flex: 1, position: "relative" }}>
          <input style={{ ...S.input, paddingLeft: 36, borderColor: "rgba(45,45,82,0.9)" }}
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for matching users..." />
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
          <Icon name="edit" size={14} color="#00ff88" />
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
              {["ID", "USER", "EMAIL", "COUNTRY", "ADMIN", "VERIFIED", "HIDDEN", "BANNED"].map(h => (
                <th key={h} style={S.th}><div style={{ display: "flex", alignItems: "center", gap: 5 }}>{h}<Icon name="sort" size={9} color="#4a5568" /></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}
                style={{ background: hover === i ? "rgba(0,255,136,0.04)" : selected.includes(u.id) ? "rgba(0,255,136,0.03)" : "transparent", transition: "background 0.15s" }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <td style={S.td}><input type="checkbox" style={S.checkbox} checked={selected.includes(u.id)} onChange={() => toggle(u.id)} /></td>
                <td style={{ ...S.td, color: "#4a5568" }}>{u.id}</td>
                <td style={{ ...S.td, color: "#00e5ff", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.textShadow = "0 0 8px rgba(0,229,255,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.textShadow = "none"}>{u.name}</td>
                <td style={{ ...S.td, color: "#8892a4" }}>{u.email}</td>
                <td style={{ ...S.td, color: "#4a5568" }}>{u.country}</td>
                <td style={S.td}>{u.admin && <span style={S.badgeAdmin}>admin</span>}</td>
                <td style={S.td}>{u.verified && <span style={S.badgeVerified}>✓</span>}</td>
                <td style={S.td}>{u.hidden && <span style={S.badgeHidden}>hidden</span>}</td>
                <td style={S.td}>{u.banned && <span style={S.badgeWrong}>banned</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace" }}>
        // showing {filtered.length} of {mockUsers.length} users{selected.length > 0 && ` · ${selected.length} selected`}
      </div>
    </div>
  );
}

export default Users;
