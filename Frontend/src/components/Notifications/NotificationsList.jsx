import useNotifications from "../../hooks/useNotifications";
import { useNotification } from "../../context/NotificationContext";
import { useEffect, useState } from "react";

export default function NotificationList() {
    const { notifications, setNotifications } = useNotifications();
    const { showNotification } = useNotification();

    const [prevIds, setPrevIds] = useState([]);

    const audio = new Audio("/notification.mp3");

    useEffect(() => {
        if (!notifications.length) return;

        const newOnes = notifications.filter(
            n => !prevIds.includes(n.id)
        );

        newOnes.forEach(n => {
            // 🔔 popup
            if (n.type === "toast") {
                showNotification(n.title, "info");
            }

            // 🔊 sound
            if (n.play_sound) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        });

        setPrevIds(notifications.map(n => n.id));

    }, [notifications]);

    const markAsRead = async (id) => {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    const deleteNotification = async (id) => {
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:8080/api/notifications/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div>
            {(Array.isArray(notifications) ? notifications : []).map(n => (
                <div key={n.id} style={{ marginBottom: "10px" }}>
                    <strong>{n.title}</strong>
                    <p>{n.content}</p>
                    <span>{n.read ? "Read" : "Unread"}</span>

                    <div>
                        {!n.read && (
                            <button onClick={() => markAsRead(n.id)}>
                                Mark Read
                            </button>
                        )}

                        <button onClick={() => deleteNotification(n.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}