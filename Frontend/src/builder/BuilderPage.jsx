import { useState } from "react";
import { useConfig } from "../context/ConfigContext";
import HomePage from "../pages/HomePage";
import Sidebar from "./Sidebar";
import PropertiesPanel from "./PropertiesPanel";
import Navbar from "../components/Navbar";

export default function BuilderPage() {
    const { config, setConfig } = useConfig();
    const [currentPage, setCurrentPage] = useState("home");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [panelType, setPanelType] = useState("none");

    return (
        <div className="builder-container">

            {/* 🔥 NAVBAR (TOP) */}
            <Navbar
                isBuilder={true}
                onSelect={() => {
                    setPanelType("navbar");
                    setSelectedIndex(null);
                }}
            />

            {/* 🔥 MAIN BUILDER GRID */}
            <div className="builder-root">

                {/* LEFT SIDEBAR */}
                <Sidebar
                    setPanelType={setPanelType}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                />

                {/* CENTER CANVAS */}
                <HomePage
                    page={currentPage}
                    isBuilder={true}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    setPanelType={setPanelType}
                />

                {/* RIGHT PANEL */}
                <PropertiesPanel
                    config={config}
                    setConfig={setConfig}
                    selectedIndex={selectedIndex}
                    panelType={panelType}
                    currentPage={currentPage}
                />

            </div>
        </div>
    );
}