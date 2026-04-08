import "./Users.css";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Users() {

    const [open, setOpen] = useState(false);

    const users = [
        {
            id: 1,
            username: "admin",
            email: "admin@admin.com",
            role: "admin",
            hidden: true,
        },
        {
            id: 2,
            username: "a",
            email: "aa@a.com",
            role: "user",
            hidden: false,
        },
    ];

    return (
        <div className="users-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Users</h1>
                <button className="add-btn" onClick={() => setOpen(true)}>
                    <Plus size={18} />
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="users-controls">
                <input placeholder="Search users..." />
                <button className="search-btn">
                    <Search size={16} />
                </button>
            </div>

            {/* TABLE */}
            <div className="card table-card">
                {/* your table stays same */}
            </div>

            {/* ✅ MODAL (MOVE HERE) */}
            {open && (
                <div className="modal-overlay" onClick={() => setOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h2>Create User</h2>

                        <div className="form-group">
                            <label>Username</label>
                            <input placeholder="Enter username" />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input placeholder="Enter email" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Enter password" />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input placeholder="Optional" />
                        </div>

                        <div className="form-row">
                            <label className="checkbox">
                                <input type="checkbox" /> Verified
                            </label>

                            <label className="checkbox">
                                <input type="checkbox" /> Hidden
                            </label>

                            <label className="checkbox">
                                <input type="checkbox" /> Banned
                            </label>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel" onClick={() => setOpen(false)}>
                                Cancel
                            </button>
                            <button className="submit-btn">
                                Create User
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );

}