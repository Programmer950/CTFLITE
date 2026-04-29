import { createContext, useContext, useState, useEffect } from "react";
import siteConfig from "../config/siteConfig";
import { applyTheme } from "../utils/applyTheme";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(null);

    const resetConfig = () => {
        setConfig(siteConfig);
    };

    const safeSetConfig = (data) => {
        if (!data?.pages?.home?.sections) {
            console.warn("Invalid config from backend, using fallback");
            setConfig(siteConfig);
        } else {
            setConfig(data);
        }
    };

    // 🔥 LOAD CONFIG
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/config");

                if (!res.ok) throw new Error("Backend error");

                const data = await res.json();
                safeSetConfig(data);

            } catch (err) {
                console.error("Failed to load config, using default", err);
                setConfig(siteConfig);
            }
        };

        loadConfig();
    }, []);

    // 🔥 APPLY THEME
    useEffect(() => {
        if (!config) return;
        applyTheme(config.theme);
    }, [config]);

    // 🔥 REFETCH FUNCTION
    const fetchConfig = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/config");
            const data = await res.json();
            safeSetConfig(data);
        } catch (err) {
            console.error("Refetch failed", err);
        }
    };

    if (!config) return null;

    return (
        <ConfigContext.Provider value={{ config, setConfig, fetchConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => useContext(ConfigContext);