import { useNotification } from "../../context/NotificationContext";
import { Check, X } from "lucide-react";

export default function NotificationPanel() {
    const { notifications, markAllRead, markOneRead, deleteNotification } = useNotification();

    return (
        <div className="notif-panel">

            <div className="notif-panel-header">
                <span>Notifications</span>
                <button onClick={markAllRead}>Mark all read</button>
            </div>

            <div className="notif-panel-list">
                {notifications.length === 0 && (
                    <div className="notif-empty">
                        No notifications yet
                    </div>
                )}

                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`notif-card ${n.read ? "" : "unread"}`}
                    >
                        <div className="notif-card-row">

                            <div className="notif-text">
                                <div className="notif-card-title">
                                    {n.title}
                                </div>

                                <div className="notif-card-content">
                                    {n.content}
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="notif-actions">

                                {!n.read && (
                                    <button
                                        className="notif-btn tick"
                                        onClick={() => markOneRead(n.id)}
                                    >
                                        <Check size={14} />
                                    </button>
                                )}

                                <button
                                    className="notif-btn delete"
                                    onClick={() => deleteNotification(n.id)}
                                >
                                    <X size={14} />
                                </button>

                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}