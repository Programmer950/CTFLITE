import { useState, useEffect } from "react";
import { applyTheme } from "../../../utils/applyTheme";

const defaultTheme = {
    colors: {
        accent: "#00d4ff",
        bg: "#0a0d14",
        surface: "#0f1420",
        text: "#e2e8f0",
        textMuted: "#64748b"
    },
    radius: {
        md: "8px"
    },
    effects: {
        glow: "0 0 20px rgba(0,212,255,0.15)"
    }
};

export default function AppearanceTab() {
    const [theme, setTheme] = useState(defaultTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const updateColor = (key, value) => {
        setTheme(prev => ({
            ...prev,
            colors: {
                ...prev.colors,
                [key]: value
            }
        }));
    };

    const updateRadius = (key, value) => {
        setTheme(prev => ({
            ...prev,
            radius: {
                ...prev.radius,
                [key]: value + "px"
            }
        }));
    };

    return (
        <div className="config-content">
            <div className="config-card">
                <h2>🎨 Colors</h2>
                <p className="section-desc">Control the visual identity of your CTF</p>
            {/* 🎨 COLORS */}
            <div className="color-grid">
                {["accent", "bg", "surface", "text", "textMuted"].map(key => (
                    <div className="color-card" key={key}>
                        <div className="color-label">{key}</div>

                        <input
                            type="color"
                            value={theme.colors[key]}
                            onChange={(e) => updateColor(key, e.target.value)}
                        />

                        <div
                            className="color-preview"
                            style={{ background: theme.colors[key] }}
                        />
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}