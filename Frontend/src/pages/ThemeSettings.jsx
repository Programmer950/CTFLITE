import { useConfig } from "../context/ConfigContext";
import { useEffect, useState } from "react";
import siteConfig from "../config/siteConfig";

export default function ThemeSettings() {
    const [toast, setToast] = useState("");
    const { config, setConfig } = useConfig();
    const theme = config?.theme || {};

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!theme) return;

        const root = document.documentElement;

        const apply = (obj) => {
            Object.entries(obj || {}).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value);
            });
        };

        apply(theme.colors);
        apply(theme.opacity);
        apply(theme.gradients);
        apply(theme.effects);
        apply(theme.radius);

    }, [theme]);

    const updateTheme = (section, key, value) => {
        setConfig(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                [section]: {
                    ...prev.theme[section],
                    [key]: value
                }
            }
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            await fetch("http://localhost:8080/admin/config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            // ✅ show toast
            setToast("Theme saved successfully");

            setTimeout(() => setToast(""), 2500);

        } catch (err) {
            console.error("Save failed", err);
            setToast("Failed to save theme");
            setTimeout(() => setToast(""), 2500);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setConfig(prev => ({
            ...prev,
            theme: siteConfig.theme
        }));
    };

    return (
        <div className="theme-page">
            <div className="theme-container">

                <div className="theme-header">
                    <h1 className="theme-title">Theme Settings</h1>

                    <div className="theme-actions">
                        <button className="reset-btn" onClick={handleReset}>
                            Reset
                        </button>

                        <button className="save-btn" onClick={handleSave}>
                            {saving ? "Saving..." : "Save Theme"}
                        </button>
                    </div>
                </div>

                {/* COLORS */}
                <Section title="Colors">
                    {Object.entries(theme.colors || {}).map(([key, value]) => (
                        <Field key={key} label={key}>
                            <input
                                type="color"
                                value={value}
                                onChange={(e) =>
                                    updateTheme("colors", key, e.target.value)
                                }
                            />
                            <input
                                value={value}
                                onChange={(e) =>
                                    updateTheme("colors", key, e.target.value)
                                }
                            />
                        </Field>
                    ))}
                </Section>

                {/* OPACITY */}
                <Section title="Opacity">
                    {Object.entries(theme.opacity || {}).map(([key, value]) => (
                        <Field key={key} label={key}>
                            <input
                                value={value}
                                onChange={(e) =>
                                    updateTheme("opacity", key, e.target.value)
                                }
                            />

                            <PreviewBox
                                style={{ background: value }}
                            />
                        </Field>
                    ))}
                </Section>

                {/* GRADIENTS */}
                <Section title="Gradients">
                    {Object.entries(theme.gradients || {}).map(([key, value]) => (
                        <Field key={key} label={key}>
                            <input
                                value={value}
                                onChange={(e) =>
                                    updateTheme("gradients", key, e.target.value)
                                }
                            />

                            <PreviewBox
                                style={{ background: value }}
                            />
                        </Field>
                    ))}
                </Section>

                {/* EFFECTS */}
                <Section title="Effects">
                    {Object.entries(theme.effects || {}).map(([key, value]) => (
                        <Field key={key} label={key}>
                            <input
                                value={value}
                                onChange={(e) =>
                                    updateTheme("effects", key, e.target.value)
                                }
                            />

                            <PreviewBox
                                style={{
                                    background: "#0b0f17",
                                    boxShadow: value
                                }}
                            />
                        </Field>
                    ))}
                </Section>

                {/* RADIUS */}
                <Section title="Radius">
                    {Object.entries(theme.radius || {}).map(([key, value]) => (
                        <Field key={key} label={key}>
                            <input
                                value={value}
                                onChange={(e) =>
                                    updateTheme("radius", key, e.target.value)
                                }
                            />

                            <PreviewBox
                                style={{
                                    borderRadius: value,
                                    background: "#1f2937"
                                }}
                            />
                        </Field>
                    ))}
                </Section>

            </div>
            {toast && <div className="theme-toast">{toast}</div>}
        </div>
    );
}

/* ---------- COMPONENTS ---------- */

function Section({ title, children }) {
    return (
        <div className="theme-section">
            <div className="theme-section-header">{title}</div>
            <div className="theme-grid">{children}</div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className="theme-field">
            <label>{label}</label>
            <div className="theme-inputs">{children}</div>
        </div>
    );
}

function PreviewBox({ style }) {
    return (
        <div
            className="theme-preview"
            style={style}
        />
    );
}