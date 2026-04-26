import { useConfig } from "../context/ConfigContext";

export default function Sidebar({ setPanelType, setCurrentPage, currentPage }) {
    const { config, setConfig, fetchConfig } = useConfig();

    const defaultProps = {
        hero: {
            eyebrow: "WELCOME TO",
            title: "CTF ",
            highlight: "LITE",
            description: "Compete in elite cybersecurity challenges.",
            ctaText: "Explore Challenges"
        },

        categories: {
            title: "Categories"
        },

        challenge_list: {
            title: "Featured Challenges"
        },

        scoreboard_preview: {
            title: "Top Hackers"
        },

        activity_feed: {
            title: "Recent Activity"
        },

        cta: {
            text: "Enter the Arena",
            button: "Start Hacking"
        },

        features: {
            title: "Why Choose Us"
        },
        rules_header: {
            title: "Rules",
            caption: "Please read all rules carefully before participating."
        },

        rule_box: {
            title: "New Rule Section",
            items: [
                "Add your first rule",
                "Add another rule"
            ]
        }
    };

    const addSection = (type) => {
        const newSection = {
            id: Date.now().toString(),
            type,
            enabled: true,
            props: defaultProps[type] || {},
            style: {}
        };

        setConfig((prev) => ({
            ...prev,
            pages: {
                ...prev.pages,
                [currentPage]: {
                    ...prev.pages[currentPage],
                    sections: [
                        ...(prev.pages[currentPage]?.sections || []),
                        newSection
                    ]
                }
            }
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        if (!config?.pages?.[currentPage]?.sections?.length) {
            alert("Cannot save empty page");
            return;
        }

        await fetch("http://localhost:8080/admin/config", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(config)
        });

        await fetchConfig();
    };

    return (
        <div className="sidebar">

            {/* 🎨 THEME */}
            <button
                className="primary-btn"
                onClick={() => setPanelType("theme")}
            >
                🎨 Theme Settings
            </button>

            {/* 📄 PAGE SWITCH */}
            <div style={{ marginBottom: "10px" }}>
                <button onClick={() => setCurrentPage("home")}>
                    Home
                </button>
                <button onClick={() => setCurrentPage("rules")}>
                    Rules
                </button>
            </div>

            {/* 🧩 WIDGETS */}
            <div className="sidebar-group">
                <h4>Add Sections</h4>

                <button onClick={() => addSection("hero")}>Hero</button>
                <button onClick={() => addSection("stats")}>Stats</button>
                <button onClick={() => addSection("categories")}>Categories</button>
                <button onClick={() => addSection("challenge_list")}>Challenges</button>
                <button onClick={() => addSection("scoreboard_preview")}>Scoreboard</button>
                <button onClick={() => addSection("activity_feed")}>Activity</button>
                <button onClick={() => addSection("cta")}>CTA</button>
                <button onClick={() => addSection("features")}>Features</button>
            </div>

            {/* ⚙️ ACTIONS */}
            <div className="sidebar-group">
                <h4>Actions</h4>

                <button onClick={handleSave}>Save to Server</button>

                <button
                    onClick={() => {
                        const data = JSON.stringify(config, null, 2);
                        const blob = new Blob([data], { type: "application/json" });

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");

                        a.href = url;
                        a.download = "ctf-config.json";
                        a.click();
                    }}
                >
                    Export Config
                </button>

                <button onClick={() => addSection("rules_header")}>Rules Header</button>
                <button onClick={() => addSection("rule_box")}>Rule Box</button>

                <input
                    type="file"
                    accept="application/json"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (event) => {
                            try {
                                const json = JSON.parse(event.target.result);
                                setConfig(json);
                            } catch {
                                alert("Invalid JSON");
                            }
                        };
                        reader.readAsText(file);
                    }}
                />

                <button onClick={() => window.location.reload()}>
                    Reset UI
                </button>

                <button onClick={() => window.location.reload()}>
                    Reset UI
                </button>
            </div>
        </div>
    );
}