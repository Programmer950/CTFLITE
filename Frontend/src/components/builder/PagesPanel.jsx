import { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Plus, X, FileText } from 'lucide-react';
import './PagesPanel.css';

export default function PagesPanel() {
    const { pages, activePage, switchPage, addPage, deletePage, setPageName } = useBuilder();
    const [editingIdx, setEditingIdx] = useState(null);
    const [editingName, setEditingName] = useState('');

    const startRename = (i, name, e) => {
        e.stopPropagation();
        setEditingIdx(i);
        setEditingName(name);
    };

    const commitRename = () => {
        if (editingIdx !== null && editingName.trim()) {
            setPageName(editingIdx, editingName.trim());
        }
        setEditingIdx(null);
    };

    return (
        <aside className="pages-panel">
            <div className="pages-panel-header">
                <FileText size={11} />
                <span>PAGES</span>
            </div>

            <div className="pages-list">
                {pages.map((page, i) => (
                    <div
                        key={page.id}
                        className={`pages-item ${activePage === i ? 'pages-item--active' : ''}`}
                        onClick={() => switchPage(i)}
                    >
                        <div className="pages-item-icon">
                            {activePage === i ? '▶' : '◻'}
                        </div>

                        {editingIdx === i ? (
                            <input
                                className="pages-item-input"
                                value={editingName}
                                autoFocus
                                onClick={e => e.stopPropagation()}
                                onChange={e => setEditingName(e.target.value)}
                                onBlur={commitRename}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') commitRename();
                                    if (e.key === 'Escape') setEditingIdx(null);
                                }}
                            />
                        ) : (
                            <span
                                className="pages-item-name"
                                onDoubleClick={e => startRename(i, page.name, e)}
                                title="Double-click to rename"
                            >
                                {page.name}
                            </span>
                        )}

                        {pages.length > 1 && (
                            <button
                                className="pages-item-delete"
                                title="Delete page"
                                onClick={e => {
                                    e.stopPropagation();
                                    if (confirm(`Delete "${page.name}"?`)) deletePage(i);
                                }}
                            >
                                <X size={10} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button className="pages-add-btn" onClick={addPage} title="Add new page">
                <Plus size={13} />
                <span>New Page</span>
            </button>
        </aside>
    );
}
