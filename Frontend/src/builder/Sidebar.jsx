import { useConfig } from "../context/ConfigContext";

export default function Sidebar({ setPanelType, setCurrentPage, currentPage }) {
    const { config, setConfig, fetchConfig, resetConfig } = useConfig();

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

            {/* HEADER */}
            <div className="sb-header">
                <div className="logo">CTFLite</div>
            </div>

            {/* THEME */}
            <div className="sb-section">
                <button
                    className="sb-primary"
                    onClick={() => setPanelType("theme")}
                >
                    🎨 Theme Settings
                </button>
            </div>

            {/* PAGES */}
            <div className="sb-section">
                <div className="sb-title">Pages</div>

                <button
                    className={`sb-tab ${currentPage === "home" ? "active" : ""}`}
                    onClick={() => setCurrentPage("home")}
                >
                    Home
                </button>

                <button
                    className={`sb-tab ${currentPage === "rules" ? "active" : ""}`}
                    onClick={() => setCurrentPage("rules")}
                >
                    Rules
                </button>
            </div>

            {/* ADD SECTIONS */}
            <div className="sb-section">
                <div className="sb-title">Add Sections</div>

                <div className="sb-grid">
                    <button onClick={() => addSection("hero")}>Hero</button>
                    <button onClick={() => addSection("stats")}>Stats</button>
                    <button onClick={() => addSection("categories")}>Categories</button>
                    <button onClick={() => addSection("challenge_list")}>Challenges</button>
                    <button onClick={() => addSection("scoreboard_preview")}>Scoreboard</button>
                    <button onClick={() => addSection("activity_feed")}>Activity</button>
                    <button onClick={() => addSection("cta")}>CTA</button>
                    <button onClick={() => addSection("features")}>Features</button>
                    <button onClick={() => addSection("rules_header")}>
                        Rules Header
                    </button>

                    <button onClick={() => addSection("rule_box")}>
                        Rule Box
                    </button>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="sb-section">
                <div className="sb-title">Actions</div>

                <button className="sb-action" onClick={handleSave}>
                    Save to Server
                </button>

                <button
                    className="sb-action"
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

                <label className="file-upload">
                    Import Config
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
                </label>

                <button className="danger" onClick={resetConfig}>
                    Reset Config
                </button>
            </div>

        </div>
    );
}