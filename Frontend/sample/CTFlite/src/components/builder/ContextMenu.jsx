import { useEffect, useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import './ContextMenu.css';

export default function ContextMenu({ x, y, targetId, onClose }) {
    const {
        selectedIds, selectedId,
        copyElements, pasteElements, clipboardElements,
        bulkDelete, deleteElement, selectAll, deselect,
        changeZIndex,
    } = useBuilder();
    const menuRef = useRef(null);

    const ids = selectedIds.length > 0 ? selectedIds : (selectedId ? [selectedId] : []);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
        };
        const keyHandler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', keyHandler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', keyHandler);
        };
    }, [onClose]);

    const run = (fn) => { fn(); onClose(); };

    const items = [
        {
            label: `Copy${ids.length > 1 ? ` (${ids.length})` : ''}`,
            shortcut: 'Ctrl+C',
            disabled: ids.length === 0,
            action: () => copyElements(ids),
        },
        {
            label: `Paste`,
            shortcut: 'Ctrl+V',
            disabled: clipboardElements.length === 0,
            action: () => pasteElements(20),
        },
        {
            label: `Duplicate`,
            shortcut: 'Ctrl+D',
            disabled: ids.length === 0,
            action: () => { copyElements(ids); setTimeout(() => pasteElements(20), 0); },
        },
        null, // divider
        {
            label: 'Bring Forward',
            shortcut: 'Ctrl+]',
            disabled: ids.length === 0,
            action: () => changeZIndex(ids, 1),
        },
        {
            label: 'Send Backward',
            shortcut: 'Ctrl+[',
            disabled: ids.length === 0,
            action: () => changeZIndex(ids, -1),
        },
        null,
        {
            label: 'Select All',
            shortcut: 'Ctrl+A',
            action: () => selectAll(),
        },
        {
            label: 'Deselect',
            shortcut: 'Esc',
            disabled: ids.length === 0,
            action: () => deselect(),
        },
        null,
        {
            label: `Delete${ids.length > 1 ? ` (${ids.length})` : ''}`,
            shortcut: 'Del',
            disabled: ids.length === 0,
            danger: true,
            action: () => { if (ids.length === 1) deleteElement(ids[0]); else bulkDelete(ids); },
        },
    ];

    return (
        <div
            ref={menuRef}
            className="ctx-menu"
            style={{ left: x, top: y }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {items.map((item, i) =>
                item === null
                    ? <div key={`div-${i}`} className="ctx-menu-sep" />
                    : (
                        <button
                            key={item.label}
                            className={`ctx-menu-item ${item.disabled ? 'ctx-menu-item--disabled' : ''} ${item.danger ? 'ctx-menu-item--danger' : ''}`}
                            onClick={() => !item.disabled && run(item.action)}
                            disabled={item.disabled}
                        >
                            <span className="ctx-menu-label">{item.label}</span>
                            <span className="ctx-menu-shortcut">{item.shortcut}</span>
                        </button>
                    )
            )}
        </div>
    );
}
