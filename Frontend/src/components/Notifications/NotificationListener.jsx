import { useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";

export default function NotificationListener() {
    const { addNotification } = useNotification(); // ✅ FIX

    useEffect(() => {
        const token = localStorage.getItem("token");

        const eventSource = new EventSource(
            `http://localhost:8080/api/notifications/stream?token=${token}`
        );

        const audio = new Audio("/notification.mp3");

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // 🔥 ADD TO GLOBAL STATE (this triggers popup too)
                addNotification({
                    ...data,
                    read: false,
                    created_at: Date.now()
                });

                // 🔊 SOUND
                if (data.play_sound) {
                    audio.currentTime = 0;
                    audio.play().catch(() => {});
                }

            } catch (err) {
                console.error("SSE parse error:", err);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return null;
}