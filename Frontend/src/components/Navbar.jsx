import { Home, Flag, Trophy, Users, User, Settings, LogOut, LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const { token, logout } = useAuth();

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="ctf-nav">

            {/* LEFT */}
            <div className="nav-left">
                <div className="nav-logo">CTFLite</div>
            </div>

            {/* CENTER */}
            <div className="nav-center">
                <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                    <Home size={16} /> Home
                </Link>

                <Link to="/challenges" className={`nav-link ${isActive("/challenges") ? "active" : ""}`}>
                    <Flag size={16} /> Challenges
                </Link>

                <Link to="/scoreboard" className={`nav-link ${isActive("/scoreboard") ? "active" : ""}`}>
                    <Trophy size={16} /> Scoreboard
                </Link>

                <Link to="/teams" className={`nav-link ${isActive("/teams") ? "active" : ""}`}>
                    <Users size={16} /> Teams
                </Link>

                <Link to="/rules" className={`nav-link ${isActive("/rules") ? "active" : ""}`}>
                    <Settings size={16} /> Rules
                </Link>
            </div>

            {/* RIGHT */}
            <div className="nav-right">

                {/* 🔓 NOT LOGGED IN */}
                {!token ? (
                    <button className="login-btn" onClick={() => navigate("/login")}>
                        <LogIn size={16} />
                        Login
                    </button>
                ) : (
                    <>
                        {/* 🔐 LOGGED IN PROFILE */}
                        <div className="nav-profile" onClick={() => setOpen(!open)}>
                            <div className="profile-avatar">
                                <User size={14} />
                            </div>
                            <span className="profile-name">player1</span>
                        </div>

                        {/* DROPDOWN */}
                        {open && (
                            <div className="profile-dropdown">

                                <div className="profile-info">
                                    <div className="profile-avatar large">
                                        <User size={18} />
                                    </div>

                                    <div>
                                        <div className="profile-name">player1</div>
                                        <div className="profile-email">player1@email.com</div>
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