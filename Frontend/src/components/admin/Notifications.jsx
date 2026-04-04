import React, { useState } from "react";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";

export function Notifications() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notifType, setNotifType] = useState("toast");
  const [playSound, setPlaySound] = useState(true);
  const [sent, setSent] = useState([]);
  const [hover, setHover] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    setSent(prev => [{ title, content, type: notifType, time: new Date().toLocaleTimeString() }, ...prev]);
    setTitle(""); setContent("");
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}><Icon name="bell" size={22} color="#00ff88" /> NOTIFICATIONS</div>
        <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>// broadcast messages to all players</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        <div style={S.card}>
          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Title</label>
            <input style={{ ...S.input, borderColor: hover === "title" ? "rgba(0,255,136,0.4)" : undefined, boxShadow: hover === "title" ? "0 0 12px rgba(0,255,136,0.12)" : undefined }}
              value={title} onChange={e => setTitle(e.target.value)}
              onFocus={() => setHover("title")} onBlur={() => setHover("")}
              placeholder="Notification title..." />
            <div style={S.hint}>// notification title shown to all users</div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Content</label>
            <textarea style={{ ...S.textarea, borderColor: hover === "content" ? "rgba(0,255,136,0.4)" : undefined, boxShadow: hover === "content" ? "0 0 12px rgba(0,255,136,0.12)" : undefined }}
              value={content} onChange={e => setContent(e.target.value)}
              onFocus={() => setHover("content")} onBlur={() => setHover("")}
              placeholder="Notification message body. Supports HTML and Markdown..." />
            <div style={S.hint}>// supports HTML and/or Markdown</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={S.label}>Notification Type</label>
              {["toast", "alert", "background"].map(t => (
                <label key={t} style={{ ...S.radioRow, marginBottom: 8 }}>
                  <input type="radio" name="notifType" value={t} checked={notifType === t}
                    onChange={() => setNotifType(t)} style={{ accentColor: "#00ff88" }} />
                  <span style={{ color: notifType === t ? "#00ff88" : "#8892a4", textTransform: "capitalize", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{t}</span>
                </label>
              ))}
              <div style={S.hint}>// notification delivery method</div>
            </div>
            <div>
              <label style={S.label}>Play Sound</label>
              <label style={{ ...S.radioRow, marginBottom: 8 }}>
                <input type="checkbox" checked={playSound} onChange={() => setPlaySound(p => !p)} style={{ accentColor: "#00ff88" }} />
                <span style={{ color: playSound ? "#00ff88" : "#8892a4", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Play Sound</span>
              </label>
              <div style={S.hint}>// audio cue for players</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={S.btnPrimary}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.12)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
              onClick={handleSubmit}>
              <Icon name="bell" size={13} color="#00ff88" /> BROADCAST
            </button>
          </div>
        </div>

        {/* Sent log */}
        <div style={S.card}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#e2e8f4", letterSpacing: 1, marginBottom: 16 }}>BROADCAST LOG</div>
          {sent.length === 0 && (
            <div style={{ color: "#4a5568", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textAlign: "center", padding: "40px 0" }}>
              // no broadcasts yet
            </div>
          )}
          {sent.map((n, i) => (
            <div key={i} style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 6, padding: "10px 14px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>{n.title}</span>
                <span style={{ color: "#4a5568", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 11, color: "#8892a4", fontFamily: "'JetBrains Mono', monospace" }}>{n.content || "(no content)"}</div>
              <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                <span style={S.badgeSolved}>{n.type}</span>
                {n.playSound && <span style={S.badgeVerified}>sound</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
