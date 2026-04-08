import { createContext, useState } from "react";
import  siteConfig  from "../config/siteConfig.js";

export const ConfigContext = createContext();

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(siteConfig);

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}