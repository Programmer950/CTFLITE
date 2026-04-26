export default function PropertiesPanel({
                                            config,
                                            setConfig,
                                            selectedIndex,
                                            panelType,
                                            currentPage
                                        }) {

    const sections = config?.pages?.[currentPage]?.sections || [];
    const section = selectedIndex !== null ? sections[selectedIndex] : null;

    // =====================
    // NOTHING SELECTED
    // =====================
    if (panelType === "none") {
        return (
            <div className="panel">
                <p>Select a section or open Theme</p>
            </div>
        );
    }

    // =====================
    // THEME PANEL
    // =====================
    if (panelType === "theme") {
        return (
            <div className="panel">
                <h3>Theme</h3>

                {Object.entries(config.theme.colors).map(([key, value]) => (
                    <div key={key} className="field">
                        <label>{key}</label>
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => {
                                const newConfig = structuredClone(config);
                                newConfig.theme.colors[key] = e.target.value;
                                setConfig(newConfig);
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    }

    // =====================
    // WIDGET PANEL
    // =====================
    if (panelType === "widget") {

        if (!section) {
            return (
                <div className="panel">
                    <p>No section selected</p>
                </div>
            );
        }

        return (
            <div className="panel">
                <h3>{section.type}</h3>

                {/* PROPS */}
                {Object.entries(section.props || {}).map(([key, value]) => (
                    <div key={key} className="field">
                        <label>{key}</label>

                        {Array.isArray(value) ? (
                            <textarea
                                value={value.join("\n")}
                                placeholder="One item per line..."
                                onChange={(e) => {
                                    const newConfig = structuredClone(config);

                                    newConfig.pages[currentPage].sections[selectedIndex].props[key] =
                                        e.target.value.split("\n"); // 🔥 NO filter

                                    setConfig(newConfig);
                                }}
                            />
                        ) : (
                            <input
                                value={value}
                                onChange={(e) => {
                                    const newConfig = structuredClone(config);

                                    newConfig.pages[currentPage].sections[selectedIndex].props[key] =
                                        e.target.value;

                                    setConfig(newConfig);
                                }}
                            />
                        )}
                    </div>
                ))}

                {/* STYLE */}
                <h3>Style</h3>

                {Object.entries(section.style || {}).map(([key, value]) => (
                    <div key={key} className="field">
                        <label>{key}</label>
                        <input
                            value={value}
                            onChange={(e) => {
                                const newConfig = structuredClone(config);

                                newConfig.pages[currentPage].sections[selectedIndex].style[key] =
                                    e.target.value;

                                setConfig(newConfig);
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    }

    // =====================
    // NAVBAR PANEL
    // =====================
    if (panelType === "navbar") {
        const navbar = config?.layout?.navbar;

        if (!navbar) {
            return (
                <div className="panel">
                    <p>Navbar config not found</p>
                </div>
            );
        }

        return (
            <div className="panel">
                <h3>Navbar</h3>

                <div className="field">
                    <label>Logo</label>
                    <input
                        value={navbar.props?.logo || ""}
                        onChange={(e) => {
                            const newConfig = structuredClone(config);

                            newConfig.layout ||= {};
                            newConfig.layout.navbar ||= { props: {} };

                            newConfig.layout.navbar.props.logo = e.target.value;

                            setConfig(newConfig);
                        }}
                    />
                </div>

                <div className="field">
                    <label>Show Teams</label>
                    <input
                        type="checkbox"
                        checked={navbar.props?.showTeams !== false}
                        onChange={(e) => {
                            const newConfig = structuredClone(config);

                            newConfig.layout ||= {};
                            newConfig.layout.navbar ||= { props: {} };

                            newConfig.layout.navbar.props.showTeams = e.target.checked;

                            setConfig(newConfig);
                        }}
                    />
                </div>

                <div className="field">
                    <label>Show Rules</label>
                    <input
                        type="checkbox"
                        checked={navbar.props?.showRules !== false}
                        onChange={(e) => {
                            const newConfig = structuredClone(config);

                            newConfig.layout ||= {};
                            newConfig.layout.navbar ||= { props: {} };

                            newConfig.layout.navbar.props.showRules = e.target.checked;

                            setConfig(newConfig);
                        }}
                    />
                </div>
            </div>
        );
    }

    return null;
}