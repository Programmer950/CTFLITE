import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // load token + fetch user
    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);

            fetch("http://localhost:8080/api/me", {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            })
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                })
                .catch(() => {
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);

        // fetch user immediately after login
        fetch("http://localhost:8080/api/me", {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then(res => res.json())
            .then(data => setUser(data));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}