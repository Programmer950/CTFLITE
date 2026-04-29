import {
    Home,
    Flag,
    Trophy,
    Users,
    User,
    Settings,
    LogOut,
    LogIn,
    Bell
} from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import NotificationPanel from "./Notifications/NotificationPanel.jsx";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";

export default function Navbar({ isBuilder = false, onSelect }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { unreadCount } = useNotification();
    const [openNotif, setOpenNotif] = useState(false);

    const { token, user, logout } = useAuth();
    const { config } = useConfig();

    const navbarConfig = config?.layout?.navbar;

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    // 🔥 helper to block navigation
    const handleNavClick = (e) => {
        if (isBuilder) {
            e.preventDefault();
            e.stopPropagation();
            onSelect?.("navbar");
        }
    };

    return (
        <div
            className={`ctf-nav ${isBuilder ? "builder-navbar" : ""}`}
            onClick={(e) => {
                if (isBuilder) {
                    e.stopPropagation();
                    onSelect?.("navbar");
                }
            }}
        >
            {/* LEFT */}
            <div className="nav-left">
                <div className="nav-logo">
                    {navbarConfig?.props?.logo || "CTFLite"}
                </div>
            </div>

            {/* CENTER */}
            <div className="nav-center">

                <Link
                    to="/"
                    onClick={handleNavClick}
                    className={`nav-link ${isActive("/") ? "active" : ""}`}
                >
                    <Home size={16} /> Home
                </Link>

                <Link
                    to="/challenges"
                    onClick={handleNavClick}
                    className={`nav-link ${isActive("/challenges") ? "active" : ""}`}
                >
                    <Flag size={16} /> Challenges
                </Link>

                <Link
                    to="/scoreboard"
                    onClick={handleNavClick}
                    className={`nav-link ${isActive("/scoreboard") ? "active" : ""}`}
                >
                    <Trophy size={16} /> Scoreboard
                </Link>

                {navbarConfig?.props?.showTeams !== false && (
                    <Link
                        to="/teams"
                        onClick={handleNavClick}
                        className={`nav-link ${isActive("/teams") ? "active" : ""}`}
                    >
                        <Users size={16} /> Teams
                    </Link>
                )}

                {navbarConfig?.props?.showRules !== false && (
                    <Link
                        to="/rules"
                        onClick={handleNavClick}
                        className={`nav-link ${isActive("/rules") ? "active" : ""}`}
                    >
                        <Settings size={16} /> Rules
                    </Link>
                )}

                {user?.is_admin && (
                    <Link to="/admin" className="admin-btn">
                        ⚙ Admin Panel
                    </Link>
                )}
            </div>

            {/* RIGHT */}
            <div className="nav-right">

                <div className="nav-bell-wrapper">
                    <div
                        className="nav-bell"
                        onClick={() => setOpenNotif(prev => !prev)}
                    >
                        <Bell size={18} />

                        {unreadCount > 0 && (
                            <span className="notif-badge">
                {unreadCount}
            </span>
                        )}
                    </div>

                    {openNotif && <NotificationPanel />}
                </div>

                {!token ? (
                    <button
                        className="login-btn"
                        onClick={(e) => {
                            if (isBuilder) {
                                e.stopPropagation();
                                onSelect?.("navbar");
                                return;
                            }
                            navigate("/login");
                        }}
                    >
                        <LogIn size={16} />
                        Login
                    </button>
                ) : (
                    <>
                        <div
                            className="nav-profile"
                            onClick={(e) => {
                                if (isBuilder) {
                                    e.stopPropagation();
                                    onSelect?.("navbar");
                                    return;
                                }
                                setOpen(!open);
                            }}
                        >
                            <div className="profile-avatar">
                                <User size={14} />
                            </div>
                            <span className="profile-name">
                                {user?.username || "User"}
                            </span>
                        </div>

                        {!isBuilder && open && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <div className="profile-avatar large">
                                        <User size={18} />
                                    </div>

                                    <div>
                                        <div className="profile-name">
                                            {user?.username || "User"}
                                        </div>
                                        <div className="profile-email">
                                            {user?.email || "No email"}
                                        </div>
                                    </div>
                                </div>

                                <div className="dropdown-divider"></div>

                                <div className="dropdown-item">
                                    <User size={14} /> Profile
                                </div>

                                <div
                                    className="dropdown-item logout"
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
                                >
                                    <LogOut size={14} /> Logout
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}