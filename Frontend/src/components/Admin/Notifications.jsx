import "./Notifications.css";
import { useState } from "react";

export default function Notifications() {
    const [type, setType] = useState("toast");
    const [playSound, setPlaySound] = useState(true);

    return (
        <div className="notifications-page">

            {/* Header */}
            <div className="page-header">
                <h1>Notifications</h1>
                <p>Create and send platform notifications</p>
            </div>

            <div className="card form-card">

                {/* Title */}
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" placeholder="Notification title" />
                </div>

                {/* Content */}
                <div className="form-group">
                    <label>Content</label>
                    <textarea rows={5} placeholder="Write your notification..." />
                </div>

                {/* Row */}
                <div className="form-row">

                    {/* Notification Type */}
                    <div className="form-group">
                        <label>Notification Type</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    checked={type === "toast"}
                                    onChange={() => setType("toast")}
                                />
                                Toast
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    checked={type === "alert"}
                                    onChange={() => setType("alert")}
                                />
                                Alert
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    checked={type === "background"}
                                    onChange={() => setType("background")}
                                />
                                Background
                            </label>
                        </div>
                    </div>

                    {/* Play Sound */}
                    <div className="form-group">
                        <label>Play Sound</label>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={playSound}
                                onChange={() => setPlaySound(!playSound)}
                            />
                            Play sound
                        </label>
                    </div>

                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button className="submit-btn">Send Notification</button>
                </div>

            </div>

        </div>
    );
}