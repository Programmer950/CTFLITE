export default function Hero({ eyebrow, title, highlight, description, ctaText }) {
    return (
        <div className="hero-banner">

            <div className="hero-eyebrow">{eyebrow}</div>

            <h1 className="hero-title">
                {title} <span className="hl">{highlight}</span>
            </h1>

            <p className="hero-sub">{description}</p>

            <button className="hero-cta">{ctaText}</button>

        </div>
    );
}