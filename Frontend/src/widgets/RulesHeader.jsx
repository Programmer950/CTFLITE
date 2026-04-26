export default function RulesHeader({ title, caption }) {
    return (
        <div className="rules-header">
            <h1 className="rules-title">{title}</h1>
            <p className="rules-sub">{caption}</p>
        </div>
    );
}