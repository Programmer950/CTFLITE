export default function Categories({ categories = [] }) {
    return (
        <div className="card">
            <h2>Categories</h2>

            <div className="grid">
                {categories.map((c) => (
                    <div key={c} className="chip">
                        {c.toUpperCase()}
                    </div>
                ))}
            </div>
        </div>
    );
}