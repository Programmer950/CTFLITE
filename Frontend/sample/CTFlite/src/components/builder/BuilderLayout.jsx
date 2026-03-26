import { DndContext } from '@dnd-kit/core';
import { useCallback, useState } from 'react';
import ToolBar from './ToolBar';
import ComponentSidebar from './ComponentSidebar';
import PagesPanel from './PagesPanel';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import ContextMenu from './ContextMenu';
import AIChatbot from './AIChatbot';
import { useBuilder } from '../../context/BuilderContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import './BuilderLayout.css';

function BuilderShell() {
    const { addElement, currentPage } = useBuilder();
    const [ctxMenu, setCtxMenu] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);

    // Export helper for keyboard shortcut
    const handleExport = useCallback(() => {
        const json = JSON.stringify({ pages: [currentPage] }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentPage?.name?.toLowerCase() || 'page'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [currentPage]);

    // Mount keyboard shortcuts
    useKeyboardShortcuts({ onExport: handleExport });

    const handleDragEnd = useCallback((event) => {
        const { active, over, delta } = event;
        if (!over || over.id !== 'canvas-drop-zone') return;

        const canvasEl = document.querySelector('.canvas-surface');
        if (!canvasEl) return;
        const rect = canvasEl.getBoundingClientRect();

        const data = active.data?.current;
        if (!data) return;

        const pointerEvent = event.activatorEvent;
        const clientX = pointerEvent.clientX + (delta?.x || 0);
        const clientY = pointerEvent.clientY + (delta?.y || 0);

        const left = Math.max(0, Math.round(clientX - rect.left));
        const top = Math.max(0, Math.round(clientY - rect.top));

        addElement({
            type: data.type,
            label: data.label,
            props: { ...data.defaultProps },
            style: { left: `${left}px`, top: `${top}px`, ...(data.defaultStyle || {}) },
        });
    }, [addElement]);

    const openCtxMenu = useCallback((e, targetId) => {
        setCtxMenu({ x: e.clientX, y: e.clientY, targetId });
    }, []);

    const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div
                className="builder-root"
                onContextMenu={(e) => {
                    if (e.target.classList.contains('canvas-surface') || e.target.classList.contains('matrix-canvas')) {
                        e.preventDefault();
                        openCtxMenu(e, null);
                    }
                }}
            >
                <ToolBar onExport={handleExport} onToggleChat={() => setChatOpen(o => !o)} chatOpen={chatOpen} />
                <div className="builder-body">
                    <ComponentSidebar />
                    <PagesPanel />
                    <CanvasWithContext onContextMenu={openCtxMenu} />
                    <PropertiesPanel />
                </div>

                {/* Global context menu */}
                {ctxMenu && (
                    <ContextMenu
                        x={ctxMenu.x}
                        y={ctxMenu.y}
                        targetId={ctxMenu.targetId}
                        onClose={closeCtxMenu}
                    />
                )}

                {/* AI Chatbot */}
                {chatOpen && <AIChatbot onClose={() => setChatOpen(false)} />}
            </div>
        </DndContext>
    );
}

// Wrapper that passes onContextMenu down through a React context or portal
function CanvasWithContext({ onContextMenu }) {
    // We use a simple div wrapper: the actual right-click is handled on element wrappers
    // which call window.dispatchEvent or we use a global event registrar
    return <CanvasContextBridge onContextMenu={onContextMenu} />;
}

import { createContext, useContext } from 'react';
export const CanvasContextMenuCtx = createContext(null);

function CanvasContextBridge({ onContextMenu }) {
    return (
        <CanvasContextMenuCtx.Provider value={onContextMenu}>
            <Canvas />
        </CanvasContextMenuCtx.Provider>
    );
}

export function useContextMenu() {
    return useContext(CanvasContextMenuCtx);
}

export default function BuilderLayout() {
    return <BuilderShell />;
}
