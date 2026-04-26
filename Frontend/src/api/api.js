const API = "http://localhost:8080";

export const fetchChallenges = async (token) => {
    const res = await fetch(`${API}/api/challenges`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.json();
};

export const fetchScoreboard = async (token) => {
    const res = await fetch(`${API}/api/scoreboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.json();
};

export const fetchMe = async (token) => {
    const res = await fetch(`${API}/api/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.json();
};

export const fetchCategories = async (token) => {
    const res = await fetch("http://localhost:8080/api/categories", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json(); // ["web", "crypto", "rev"]
};

export const fetchStats = async (token) => {
    const res = await fetch("http://localhost:8080/api/stats", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch stats");
    }

    return res.json();
};