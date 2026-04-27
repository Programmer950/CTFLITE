import { useEffect, useState } from "react";

export default function useNotifications() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:8080/api/notifications?page=1&limit=20",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (Array.isArray(data.notifications)) {
                setNotifications(data.notifications);
            } else {
                console.error("Invalid notifications response:", data);
                setNotifications([]);
            }

        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setNotifications([]);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 8000);
        return () => clearInterval(interval);
    }, []);

    return {
        notifications,
        setNotifications,
        refetch: fetchNotifications
    };
}