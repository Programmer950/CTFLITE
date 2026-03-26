import { useBuilder } from '../../context/BuilderContext';
import {
    Undo2, Redo2, Eye, EyeOff, Monitor, Tablet, Smartphone,
    Download, Zap, Bot
} from 'lucide-react';
import './ToolBar.css';

export default function ToolBar({ onExport, onToggleChat, chatOpen }) {
    const {
        undo, redo, canUndo, canRedo,
        viewport, setViewport,
        togglePreview, previewMode,
    } = useBuilder();

    return (
        <header className="toolbar">
            {/* Brand */}
            <div className="toolbar-brand">
                <Zap size={16} className="brand-icon" />
                <span className="brand-name">CTF<span className="brand-accent">//</span>BUILDER</span>
            </div>

            <div className="toolbar-sep" />

            {/* Viewport switcher */}
            <div className="toolbar-group">
                {[['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]].map(([vp, Icon]) => (
                    <button
                        key={vp}
                        className={`toolbar-btn ${viewport === vp ? 'toolbar-btn--active' : ''}`}
                        onClick={() => setViewport(vp)}
                        title={vp}
                    >
                        <Icon size={15} />
                    </button>
                ))}
            </div>

            <div className="toolbar-sep" />

            {/* Undo / Redo */}
            <div className="toolbar-group">
                <button className={`toolbar-btn ${!canUndo ? 'toolbar-btn--disabled' : ''}`} onClick={undo} title="Undo (Ctrl+Z)" disabled={!canUndo}>
                    <Undo2 size={14} />
                </button>
                <button className={`toolbar-btn ${!canRedo ? 'toolbar-btn--disabled' : ''}`} onClick={redo} title="Redo (Ctrl+Y)" disabled={!canRedo}>
                    <Redo2 size={14} />
                </button>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* AI Build toggle */}
            <button
                className={`toolbar-btn-special toolbar-btn-ai ${chatOpen ? 'toolbar-btn-special--preview' : ''}`}
                onClick={onToggleChat}
                title="AI Page Builder"
            >
                <Bot size={14} />
                {chatOpen ? 'CLOSE AI' : 'AI BUILD'}
            </button>

            <div className="toolbar-sep" />

            {/* Preview */}
            <button
                className={`toolbar-btn-special ${previewMode ? 'toolbar-btn-special--preview' : ''}`}
                onClick={togglePreview}
            >
                {previewMode ? <><EyeOff size={14} /> EXIT PREVIEW</> : <><Eye size={14} /> PREVIEW</>}
            </button>

            {/* Export */}
            <button className="toolbar-btn-export" onClick={onExport} title="Export page JSON (Ctrl+S)">
                <Download size={14} />
                <span>EXPORT</span>
            </button>
        </header>
    );
}
