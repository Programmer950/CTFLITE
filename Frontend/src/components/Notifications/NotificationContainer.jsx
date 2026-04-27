import { useNotification } from "../../context/NotificationContext";

export default function NotificationContainer() {
    const { popup } = useNotification();

    if (!popup) return null;

    return (
        <div className={`notif-popup ${popup.type}`}>
            <strong>{popup.title}</strong>
            <p>{popup.content}</p>
        </div>
    );
}