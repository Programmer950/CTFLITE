import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null; // or spinner

    // ❌ not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // ❌ not admin
    if (!user.is_admin) {
        return <Navigate to="/" />;
    }

    // ✅ admin
    return children;
}