const siteConfig = {
    theme: {
        colors: {
            bg: "#0a0d14",
            surface: "#0f1420",
            surface2: "#151c2e",
            accent: "#00d4ff",
            text: "#e2e8f0",
            border: "#1e2d4a"
        },
        radius: {
            md: "8px",
            lg: "12px"
        }
    },

    pages: {
        home: {
            sections: [
                {
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
                    type: "stats",
                    enabled: true
                },

                {
                    type: "main_panel",   // 🔥 NEW (important)
                    enabled: true
                },

                {
                    type: "recent_activity",
                    enabled: true
                }
            ]
        }
    }
};

export default siteConfig;