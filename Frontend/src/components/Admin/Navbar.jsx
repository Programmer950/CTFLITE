import "./Navbar.css";
import { NavLink } from "react-router-dom";

import {
    BarChart3,
    Bell,
    Users,
    Trophy,
    Flag,
    Terminal,
    Settings
} from "lucide-react";

export default function Navbar() {
    return (
        <div className="navbar">

            {/* LEFT */}
            <div className="navbar-left">
                <span className="logo">CTFLite</span>
                <span className="divider">//</span>
                <span className="panel">Admin</span>
            </div>

            {/* CENTER */}
            <div className="navbar-center">

                <NavLink to="/admin/statistics" className="nav-item">
                    <BarChart3 size={16} />
                    <span>  Statistics</span>
                </NavLink>

                <NavLink to="/admin/notifications" className="nav-item">
                    <Bell size={16} />
                    <span>  Notifications</span>
                </NavLink>

                <NavLink to="/admin/users" className="nav-item">
                    <Users size={16} />
                    <span>  Users</span>
                </NavLink>

                <NavLink to="/admin/scoreboard" className="nav-item">
                    <Trophy size={16} />
                    <span>  Scoreboard</span>
                </NavLink>

                <NavLink to="/admin/challenges" className="nav-item">
                    <Flag size={16} />
                    <span>  Challenges</span>
                </NavLink>

                <NavLink to="/admin/submissions" className="nav-item">
                    <Terminal size={16} />
                    <span>  Submissions</span>
                </NavLink>

                <NavLink to="/admin/config" className="nav-item">
                    <Settings size={16} />
                    <span>  Config</span>
                </NavLink>

            </div>

            {/* RIGHT */}
            <div className="navbar-right">
                <div className="user">admin</div>
            </div>
        </div>
    );
}