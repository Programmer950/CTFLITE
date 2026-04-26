export default function CTA({ text = "Start Playing", button = "Join Now" }) {
    return (
        <div className="cta-section">
            <h2>{text}</h2>
            <button className="cta-btn">{button}</button>
        </div>
    );
}