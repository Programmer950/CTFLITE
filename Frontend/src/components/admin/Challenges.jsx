import React, { useState, useEffect } from "react";
import axios from "axios";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";

export function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [search, setSearch] = useState("");
  const [field, setField] = useState("Title");
  const [selected, setSelected] = useState([]);
  const [hover, setHover] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    difficulty: "easy",
    points: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/admin/challenges', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      // If the backend isn't connected yet, the SPA router might return an HTML string.
      // We must ensure the state only receives an array to prevent .filter() from crashing.
      setChallenges(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch challenges:", err);
      setChallenges([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setFormData({ title: "", category: "", description: "", difficulty: "easy", points: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = () => {
    if (selected.length !== 1) {
      alert("Please select exactly one challenge to edit.");
      return;
    }
    const c = challenges.find(x => x.id === selected[0]);
    if (c) {
      setFormData({
        title: c.title || "",
        category: c.category || "",
        description: c.description || "",
        difficulty: c.difficulty || "easy",
        points: c.points || ""
      });
      setEditingId(c.id);
      setShowModal(true);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        difficulty: formData.difficulty,
        points: Number(formData.points)
      };

      if (editingId) {
        await axios.put(`/admin/challenges/${editingId}`, payload, { headers });
      } else {
        await axios.post('/admin/challenges', payload, { headers });
      }

      setShowModal(false);
      setSelected([]);
      fetchChallenges();
    } catch (err) {
      console.error("Failed to save challenge:", err);
      alert("Error saving challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selected.length} challenge(s)?`)) return;

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Delete selected sequentially or with Promise.all
      await Promise.all(selected.map(id =>
        axios.delete(`/admin/challenges/${id}`, { headers })
      ));

      setSelected([]);
      fetchChallenges();
    } catch (err) {
      console.error("Failed to delete challenge(s):", err);
      alert("Error deleting challenge(s)");
    }
  };

  const catColors = { web: "#00e5ff", crypto: "#9d4edd", forensics: "#ffd60a", reverse: "#ff6b35", pwn: "#ff3864" };
  const getCatColor = (cat) => catColors[(cat || "").toLowerCase()] || "#00ff88";

  // Safeguard: make sure challenges is an array before attempting to .filter it
  const filtered = Array.isArray(challenges) ? challenges.filter(c => {
    const val = field === "Title" ? c.title : field === "Category" ? c.category : String(c.points);
    return (val || "").toLowerCase().includes(search.toLowerCase());
  }) : [];

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length && filtered.length > 0 ? [] : filtered.map(c => c.id));

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={S.pageTitle}><Icon name="flag" size={22} color="#00ff88" /> CHALLENGES</div>
          <button style={{ ...S.btnIcon, borderRadius: "50%", padding: "6px" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.15)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,255,136,0.05)"; e.currentTarget.style.boxShadow = "none"; }}
            onClick={openCreate}>
            <Icon name="plus" size={14} color="#00ff88" />
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>// dynamic challenge management</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <select style={{ ...S.select, width: 140 }} value={field} onChange={e => setField(e.target.value)}>
          {["Title", "Category", "Points"].map(f => <option key={f}>{f}</option>)}
        </select>
        <div style={{ flex: 1, position: "relative" }}>
          <input style={{ ...S.input, paddingLeft: 36 }} value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search by ${field.toLowerCase()}...`} />
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={13} color="#4a5568" />
          </div>
        </div>
        <button style={{ ...S.btnPrimary, padding: "9px 16px" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
          <Icon name="search" size={13} color="#00ff88" />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 10 }}>
        <button style={{ ...S.btnIcon, opacity: selected.length === 1 ? 1 : 0.5, pointerEvents: selected.length === 1 ? "auto" : "none" }}
          onClick={openEdit}
          title="Edit selected challenge"
          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,136,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,255,136,0.05)"}>
          <Icon name="edit" size={14} color="#00ff88" />
        </button>
        <button style={{ ...S.btnIconDanger, opacity: selected.length > 0 ? 1 : 0.5, pointerEvents: selected.length > 0 ? "auto" : "none" }}
          onClick={handleDelete}
          title="Delete selected challenges"
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,56,100,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,56,100,0.05)"}>
          <Icon name="trash" size={14} color="#ff3864" />
        </button>
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: 40 }}><input type="checkbox" style={S.checkbox} checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
              {["ID", "TITLE", "CATEGORY", "DIFFICULTY", "POINTS", "SOLVED", "SOLVES"].map(h => (
                <th key={h} style={S.th}><div style={{ display: "flex", alignItems: "center", gap: 5 }}>{h}<Icon name="sort" size={9} color="#4a5568" /></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...S.td, textAlign: "center", color: "#4a5568", padding: "30px 0" }}>No challenges found.</td>
              </tr>
            ) : filtered.map((ch, i) => (
              <tr key={ch.id}
                style={{ background: hover === i ? "rgba(0,255,136,0.04)" : selected.includes(ch.id) ? "rgba(0,255,136,0.03)" : "transparent", transition: "background 0.15s" }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <td style={S.td}><input type="checkbox" style={S.checkbox} checked={selected.includes(ch.id)} onChange={() => toggle(ch.id)} /></td>
                <td style={{ ...S.td, color: "#4a5568" }}>{ch.id}</td>
                <td style={{ ...S.td, color: "#00e5ff", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.textShadow = "0 0 8px rgba(0,229,255,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.textShadow = "none"}>{ch.title}</td>
                <td style={S.td}>
                  <span style={{ ...S.badgeSolved, background: `${getCatColor(ch.category)}18`, color: getCatColor(ch.category), border: `1px solid ${getCatColor(ch.category)}44` }}>
                    {(ch.category || "General").toUpperCase()}
                  </span>
                </td>
                <td style={{ ...S.td, color: "#8892a4" }}>{ch.difficulty}</td>
                <td style={{ ...S.td, color: "#ffd60a", fontWeight: 600 }}>{ch.points} pts</td>
                <td style={S.td}>{ch.solved ? <Icon name="check" size={14} color="#00ff88" /> : <Icon name="x" size={14} color="#4a5568" />}</td>
                <td style={{ ...S.td, color: "#4a5568" }}>{ch.solve_count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unified Add/Edit Challenge Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 20px" }}
          onClick={() => setShowModal(false)}>
          <div style={{ ...S.card, width: 600, border: "1px solid rgba(0,255,136,0.25)", boxShadow: "0 0 40px rgba(0,255,136,0.15)", position: "relative" }}
            onClick={e => e.stopPropagation()}>
            {/* Close btn */}
            <div style={{ position: "absolute", top: 12, right: 16 }}>
              <button style={{ background: "none", color: "#4a5568", cursor: "pointer", border: "none" }} onClick={() => setShowModal(false)}><Icon name="x" size={20} color="#4a5568" /></button>
            </div>

            <div style={{ fontSize: 18, color: "#00ff88", marginBottom: 20 }}>
              {editingId ? "Edit Challenge" : "Create New Challenge"}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Title:</label>
              <input name="title" value={formData.title} onChange={handleInputChange} style={{ ...S.input, width: "100%", maxWidth: "100%" }} placeholder="Challenge Title" />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Category:</label>
              <input name="category" value={formData.category} onChange={handleInputChange} style={{ ...S.input, width: "100%", maxWidth: "100%" }} placeholder="e.g., web, crypto, pwn" />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Difficulty:</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} style={{ ...S.select, width: "100%", maxWidth: "100%" }}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Points:</label>
              <input name="points" type="number" value={formData.points} onChange={handleInputChange} style={{ ...S.input, width: "100%", maxWidth: "100%" }} placeholder="e.g., 100" />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: "100%", minHeight: 120, background: "rgba(10,10,20,0.9)", border: "1px solid rgba(45,45,82,0.9)", color: "#e2e8f4", padding: 12, resize: "vertical", outline: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, borderRadius: 4 }} placeholder="Challenge description and clues..." />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button style={{ ...S.btn, padding: "10px 24px" }} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={{ ...S.btnPrimary, padding: "10px 24px" }}
                disabled={loading}
                onClick={handleSave}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
                {loading ? "Saving..." : "Save Challenge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Challenges;
