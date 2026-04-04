import React from "react";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";
import { StatBox } from "./StatBox";
import { MiniBar } from "./MiniBar";
import { DonutChart } from "./DonutChart";
import { LineChart } from "./LineChart";

export function Statistics() {
  const mockSolves = [
    { name: "Binary Exploitation - ret2win", solves: 18, color: "#00ff88" },
    { name: "Web - SQL Injection 101", solves: 24, color: "#00e5ff" },
    { name: "Crypto - RSA Basics", solves: 12, color: "#9d4edd" },
    { name: "Forensics - Memory Dump", solves: 9, color: "#ffd60a" },
    { name: "Reverse - crackme.exe", solves: 6, color: "#ff6b35" },
  ];
  const progressData = [
    { l: "T0", v: 0 }, { l: "T1", v: 120 }, { l: "T2", v: 340 }, { l: "T3", v: 280 },
    { l: "T4", v: 520 }, { l: "T5", v: 440 }, { l: "T6", v: 680 }, { l: "T7", v: 720 },
  ];
  const distData = [
    { l: "0-100", v: 2 }, { l: "100-300", v: 5 }, { l: "300-600", v: 8 }, { l: "600-900", v: 4 }, { l: "900+", v: 2 },
  ];
  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}><Icon name="stats" size={22} color="#00ff88" /> STATISTICS</div>
        <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>// live event analytics dashboard</div>
      </div>

      <div style={S.statGrid}>
        <StatBox value="42" label="Total Users" icon="users" color="#00ff88" glow="rgba(0,255,136,0.25)" />
        <StatBox value="17" label="Unique IPs" icon="globe" color="#00e5ff" glow="rgba(0,229,255,0.2)" />
        <StatBox value="3840" label="Total Points" icon="award" color="#9d4edd" glow="rgba(157,78,221,0.25)" />
        <StatBox value="5" label="Challenges" icon="flag" color="#ffd60a" glow="rgba(255,214,10,0.2)" />
      </div>

      {/* Player Progression */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: "#e2e8f4", letterSpacing: 1 }}>
            PLAYER PROGRESSION <span style={{ color: "#4a5568", fontSize: 11 }}>(Top 100)</span>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            {[["Solved", "#00ff88"], ["Attempted", "#ffd60a"], ["Opened", "#00e5ff"]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, color: "#8892a4" }}>
                <div style={{ width: 8, height: 8, background: c, borderRadius: 2, boxShadow: `0 0 4px ${c}` }} />{l}
              </span>
            ))}
          </div>
        </div>
        <LineChart title="" data={progressData} color="#00ff88" />
        {/* Table */}
        <div style={{ ...S.tableWrap, marginTop: 18 }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["PLACE", "USER", "SCORE"].map(h => (
                  <th key={h} style={S.th}><div style={{ display: "flex", alignItems: "center", gap: 6 }}>{h}<Icon name="sort" size={10} color="#4a5568" /></div></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[["🥇 1", "0xdeadbeef", "2400"], ["🥈 2", "n00bsl4yer", "1800"], ["🥉 3", "pwn_master", "1440"]].map(([p, u, s], i) => (
                <tr key={i} style={{ transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,136,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...S.td, color: "#ffd60a" }}>{p}</td>
                  <td style={{ ...S.td, color: "#00e5ff" }}>{u}</td>
                  <td style={{ ...S.td, color: "#00ff88" }}>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={S.card}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#e2e8f4", letterSpacing: 1, marginBottom: 16 }}>SOLVE COUNTS</div>
          {mockSolves.map((ch, i) => (
            <MiniBar key={i} label={ch.name} val={ch.solves} max={30} color={ch.color} />
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#e2e8f4", letterSpacing: 1, marginBottom: 16 }}>SCORE DISTRIBUTION</div>
          <LineChart title="Score Bracket" data={distData} color="#9d4edd" />
        </div>
      </div>

      {/* Donut row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div style={{ ...S.card, display: "flex", justifyContent: "center" }}>
          <DonutChart title="Submission Percentages"
            segments={[{ label: "Solves", value: 68, color: "#00ff88" }, { label: "Fails", value: 32, color: "#ff3864" }]} />
        </div>
        <div style={{ ...S.card, display: "flex", justifyContent: "center" }}>
          <DonutChart title="Category Breakdown"
            segments={[
              { label: "Web", value: 30, color: "#00e5ff" }, { label: "Pwn", value: 25, color: "#00ff88" },
              { label: "Crypto", value: 20, color: "#9d4edd" }, { label: "Misc", value: 25, color: "#ffd60a" }
            ]} />
        </div>
        <div style={{ ...S.card, display: "flex", justifyContent: "center" }}>
          <DonutChart title="Point Breakdown"
            segments={[
              { label: "Easy", value: 40, color: "#00ff88" }, { label: "Medium", value: 35, color: "#ffd60a" }, { label: "Hard", value: 25, color: "#ff3864" }
            ]} />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
