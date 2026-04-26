export default function RuleBox({ title, items = [] }) {
    return (
        <div className="rule-section">
            <h3>{title}</h3>
            <ul>
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
}