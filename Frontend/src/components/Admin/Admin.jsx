import "./Admin.css";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Admin() {
    return (
        <div className="admin-page">
            <Navbar />

            <div className="admin-container">
                <Outlet />
            </div>
        </div>
    );
}