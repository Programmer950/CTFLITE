const siteConfig = {
    theme: {
        colors: {
            bg: "#0a0d14",
            surface: "#0f1420",
            surface2: "#151c2e",
            border: "#1e2d4a",

            accent: "#00d4ff",
            accent2: "#7c3aed",
            accent3: "#10b981",
            warn: "#f59e0b",
            danger: "#ef4444",

            text: "#e2e8f0",
            textMuted: "#64748b",
            textDim: "#94a3b8",

            black: "#000000",
            white: "#ffffff",

            gold: "#fbbf24",
            silver: "#94a3b8",
            bronze: "#cd7c2f",

            success: "#22c55e",
            error: "#ef4444",

            customOrange: "orange"
        },

        opacity: {
            navBg: "rgba(10,13,20,0.95)",
            hoverAccentSoft: "rgba(0,212,255,0.08)",
            hoverAccentVerySoft: "rgba(0,212,255,0.03)",

            borderSoft: "rgba(30,45,74,0.5)",
            borderVerySoft: "rgba(30,45,74,0.4)",

            modalOverlay: "rgba(0,0,0,0.6)",
            modalOverlayStrong: "rgba(0,0,0,0.7)",
            heroRadial: "rgba(0,212,255,0.08)",
            heroTextBg: "rgba(0,212,255,0.04)",

            successSoft: "rgba(16,185,129,0.12)",
            warnSoft: "rgba(245,158,11,0.12)",
            dangerSoft: "rgba(239,68,68,0.12)"
        },

        gradients: {
            avatar: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            heroBg: "linear-gradient(135deg, #0d1a2e, #0f1420)",
            cta: "linear-gradient(90deg, #06b6d4, #22d3ee)",
            avatarReversed: "linear-gradient(135deg, #3b82f6, #06b6d4)"
        },

        effects: {
            glow: "0 0 20px rgba(0,212,255,0.15)",
            glowStrong: "0 0 40px rgba(0,212,255,0.3)",
            textGlow: "0 0 10px rgba(0,212,255,0.5)",
            textGlowStrong: "0 0 8px rgba(0,212,255,0.6)",
            boxShadowHeavy: "0 10px 30px rgba(0,0,0,0.5)",
            boxShadowModal: "0 10px 40px rgba(0,0,0,0.6)",
            ctaShadow: "0 0 30px rgba(34,211,238,0.4)",
            glow10px: "0 0 10px rgba(0,212,255,0.6)"
        },

        radius: {
            sm: "6px",
            md: "8px",
            lg: "12px",
            pill: "20px",
            circle: "50%",
            base: "8px"
        }
    },

    /* 🔥 NEW: GLOBAL LAYOUT CONFIG */
    layout: {
        navbar: {
            enabled: true,
            props: {
                logo: "CTFLite",
                showTeams: true,
                showRules: true
            }
        }
    },

    pages: {
        home: {
            sections: [
                {
                    id: "hero-1",
                    type: "hero",
                    enabled: true,
                    props: {
                        eyebrow: "WELCOME TO",
                        title: "CTF ",
                        highlight: "LITE",
                        description:
                            "Compete in elite cybersecurity challenges designed for hackers.",
                        ctaText: "Explore Challenges"
                    }
                },
                {
                    id: "stats-1",
                    type: "stats",
                    enabled: true,
                    props: {}
                },
                {
                    id: "categories-1",
                    type: "categories",
                    enabled: true,
                    props: {}
                },
                {
                    id: "challenges-1",
                    type: "challenge_list",
                    enabled: true,
                    props: {
                        title: "Featured Challenges"
                    }
                },
                {
                    id: "scoreboard-1",
                    type: "scoreboard_preview",
                    enabled: true,
                    props: {}
                },
                {
                    id: "activity-1",
                    type: "activity_feed",
                    enabled: true,
                    props: {}
                },
                {
                    id: "cta-1",
                    type: "cta",
                    enabled: true,
                    props: {
                        text: "Ready to Hack?",
                        button: "Join Now"
                    }
                }
            ]
        },
        rules: {
            sections: [
                {
                    id: "rules-header-1",
                    type: "rules_header",
                    enabled: true,
                    props: {
                        title: "Rules",
                        caption: "Please read all rules carefully before participating."
                    }
                },
                {
                    id: "rule-box-1",
                    type: "rule_box",
                    enabled: true,
                    props: {
                        title: "General Rules",
                        items: [
                            "No attacking the platform infrastructure.",
                            "No sharing flags with other teams.",
                            "Respect all participants."
                        ]
                    }
                },
                {
                    id: "rule-box-2",
                    type: "rule_box",
                    enabled: true,
                    props: {
                        title: "Flag Format",
                        items: [
                            "All flags follow format: flag{...}",
                            "Flags are case-sensitive."
                        ]
                    }
                }
            ]
        }
    }
};

export default siteConfig;