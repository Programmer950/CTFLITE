import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CTFdAdmin.css";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";
import { NavBtn } from "./NavBtn";
import { Statistics } from "./Statistics";
import { Notifications } from "./Notifications";
import { Users } from "./Users";
import { Scoreboard } from "./Scoreboard";
import { Challenges } from "./Challenges";
import { Submissions } from "./Submissions";
import { Config } from "./Config";

export default function CTFdAdmin() {
  const navigate = useNavigate();
  const [active, setActive] = useState("statistics");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    { id: "statistics", label: "Statistics", icon: "stats" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "users", label: "Users", icon: "users" },
    { id: "scoreboard", label: "Scoreboard", icon: "trophy" },
    { id: "challenges", label: "Challenges", icon: "flag" },
    { id: "submissions", label: "Submissions", icon: "terminal" },
    { id: "config", label: "Config", icon: "settings" },
  ];

  const pages = {
    statistics: <Statistics />,
    notifications: <Notifications />,
    users: <Users />,
    scoreboard: <Scoreboard />,
    challenges: <Challenges />,
    submissions: <Submissions />,
    config: <Config />,
  };

  return (
    <div style={S.root}>
      {/* Scanline overlay 
      <div style={S.scanline} />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)", pointerEvents: "none", zIndex: 9999, animation: "scanline 6s linear infinite", opacity: 0.4 }} />
      */}
      {/* Topbar */}
      <div style={S.topbar}>
        {/* Logo */}
        <div style={S.logo}>
          <Icon name="logo" size={18} color="#00ff88" />
          CTF<span style={{ color: "#00e5ff" }}>//</span>ADMIN
          <span className="blink" style={{ color: "#00ff88", fontSize: 16 }}>_</span>
        </div>

        <div style={S.navSep} />

        {/* Nav items */}
        {navItems.map(item => (
          <NavBtn key={item.id} icon={item.icon} label={item.label}
            active={active === item.id} onClick={() => setActive(item.id)} />
        ))}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 15 }}>
          {/* BUILD Highlighted Navigation Button */}
          <button
            onClick={() => navigate("/builder")}
            style={{
              background: "linear-gradient(90deg, #ff0055 0%, #ff00aa 100%)",
              color: "#fff",
              border: "1px solid rgba(255, 0, 170, 0.4)",
              padding: "4px 16px",
              borderRadius: "4px",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              letterSpacing: "2px",
              textTransform: "uppercase",
              boxShadow: "0 0 10px rgba(255, 0, 85, 0.4), inset 0 0 5px rgba(255, 0, 170, 0.2)",
              transition: "all 0.3s ease",
              textShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
              display: "flex",
              alignItems: "center"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 0, 85, 0.8), inset 0 0 10px rgba(255, 0, 170, 0.4)";
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.border = "1px solid rgba(255, 0, 170, 0.8)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 10px rgba(255, 0, 85, 0.4), inset 0 0 5px rgba(255, 0, 170, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.border = "1px solid rgba(255, 0, 170, 0.4)";
            }}
          >
            BUILD
          </button>

          <div style={S.navSep} />
          <button style={{ ...S.btnIcon, padding: "6px" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,136,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,255,136,0.05)"}>
            <Icon name="help" size={14} color="#4a5568" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={S.body}>
        <main style={S.main}>
          <div style={{ animation: "fadeIn 0.3s ease" }} key={active}>
            {pages[active]}
          </div>
        </main>
      </div>
    </div>
  );
}
