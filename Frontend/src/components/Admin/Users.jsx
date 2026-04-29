import "./Users.css";
import { Search, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Users() {

    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        country: "",
        verified: false,
        hidden: false,
        banned: false,
    });

    const token = localStorage.getItem("token");

    // 🔥 FETCH USERS
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("http://localhost:8080/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch users");
                }

                setUsers(Array.isArray(data) ? data : []);

            } catch (err) {
                console.error("Users fetch error:", err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    // 🔥 CREATE USER
    async function handleCreateUser() {
        try {
            const res = await fetch("http://localhost:8080/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create user");
            }

            // update UI instantly
            setUsers(prev => [...prev, data]);

            setOpen(false);

            // reset form
            setForm({
                username: "",
                email: "",
                password: "",
                country: "",
                verified: false,
                hidden: false,
                banned: false,
            });

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    // 🔥 DELETE USER
    async function handleDelete(id) {
        const confirmDelete = confirm("Delete user?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:8080/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            setUsers(prev => prev.filter(u => u.id !== id));

        } catch (err) {
            console.error(err);
            alert("Failed to delete user");
        }
    }

    if (loading) {
        return <div className="users-page">Loading users...</div>;
    }

    return (
        <div className="users-page">

            {/* HEADER */}
            <div className="page-header center">
                <h1>Users</h1>
                <button className="add-btn" onClick={() => setOpen(true)}>
                    <Plus size={18} />
                </button>
            </div>

            {/* SEARCH (UI only for now) */}
            <div className="users-controls">
                <input placeholder="Search users..." />
                <button className="search-btn">
                    <Search size={16} />
                </button>
            </div>

            {/* TABLE */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6">No users found</td>
                        </tr>
                    ) : (
                        users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.role || "user"}</td>

                                <td>
                                    {u.hidden ? (
                                        <span className="badge hidden">Hidden</span>
                                    ) : (
                                        <span className="badge active">Active</span>
                                    )}
                                </td>

                                <td className="actions">
                                    <button
                                        className="icon-btn danger"
                                        onClick={() => handleDelete(u.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {open && (
                <div className="modal-overlay" onClick={() => setOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h2>Create User</h2>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={form.verified}
                                    onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                                /> Verified
                            </label>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={form.hidden}
                                    onChange={(e) => setForm({ ...form, hidden: e.target.checked })}
                                /> Hidden
                            </label>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={form.banned}
                                    onChange={(e) => setForm({ ...form, banned: e.target.checked })}
                                /> Banned
                            </label>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel" onClick={() => setOpen(false)}>
                                Cancel
                            </button>

                            <button className="submit-btn" onClick={handleCreateUser}>
                                Create User
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}