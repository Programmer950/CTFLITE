import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("notifications");
        return saved ? JSON.parse(saved) : [];
    });
    const [popup, setPopup] = useState(null);

    const deleteNotification = (id) => {
        setNotifications(prev =>
            prev.filter(n => n.id !== id)
        );
    };

    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    const markOneRead = (id) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    const addNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);

        // show popup
        setPopup(notif);

        setTimeout(() => {
            setPopup(null);
        }, 3000);
    };

    const markAllRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                popup,
                unreadCount,
                markAllRead,
                markOneRead,
                deleteNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);