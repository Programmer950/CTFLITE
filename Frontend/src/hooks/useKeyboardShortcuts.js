import { useEffect, useCallback } from 'react';
import { useBuilder } from '../context/BuilderContext';

export function useKeyboardShortcuts({ onExport }) {
    const {
        selectedIds, selectedId,
        undo, redo, canUndo, canRedo,
        selectAll, deselect,
        copyElements, pasteElements,
        bulkDelete, deleteElement,
        bulkMoveCommit,
        changeZIndex,
        addElement,
        currentPage,
        previewMode,
    } = useBuilder();

    const getActiveIds = useCallback(() => {
        if (selectedIds.length > 0) return selectedIds;
        if (selectedId) return [selectedId];
        return [];
    }, [selectedIds, selectedId]);

    useEffect(() => {
        const handler = (e) => {
            // Don't intercept shortcuts when typing in inputs
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            // Don't intercept in preview mode
            if (previewMode) return;

            const ctrl = e.ctrlKey || e.metaKey;
            const shift = e.shiftKey;
            const key = e.key;

            // --- Undo / Redo ---
            if (ctrl && !shift && key === 'z') { e.preventDefault(); if (canUndo) undo(); return; }
            if (ctrl && (key === 'y' || (shift && key === 'Z'))) { e.preventDefault(); if (canRedo) redo(); return; }

            // --- Select All ---
            if (ctrl && key === 'a') { e.preventDefault(); selectAll(); return; }

            // --- Escape / Deselect ---
            if (key === 'Escape') { e.preventDefault(); deselect(); return; }

            const ids = getActiveIds();

            // --- Delete / Backspace ---
            if ((key === 'Delete' || key === 'Backspace') && ids.length > 0) {
                e.preventDefault();
                if (ids.length === 1) deleteElement(ids[0]);
                else bulkDelete(ids);
                return;
            }

            // --- Copy ---
            if (ctrl && !shift && key === 'c' && ids.length > 0) {
                e.preventDefault();
                copyElements(ids);
                return;
            }

            // --- Paste ---
            if (ctrl && !shift && key === 'v') {
                e.preventDefault();
                pasteElements(20);
                return;
            }

            // --- Duplicate ---
            if (ctrl && !shift && key === 'd' && ids.length > 0) {
                e.preventDefault();
                // Copy then immediately paste
                copyElements(ids);
                // Small timeout to let copy state settle
                setTimeout(() => pasteElements(20), 0);
                return;
            }

            // --- Export / Save ---
            if (ctrl && !shift && key === 's') {
                e.preventDefault();
                if (onExport) onExport();
                return;
            }

            // --- Arrow Nudge ---
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key) && ids.length > 0) {
                e.preventDefault();
                const step = shift ? 10 : 1;
                let dx = 0, dy = 0;
                if (key === 'ArrowLeft') dx = -step;
                if (key === 'ArrowRight') dx = step;
                if (key === 'ArrowUp') dy = -step;
                if (key === 'ArrowDown') dy = step;
                bulkMoveCommit(ids, dx, dy);
                return;
            }

            // --- Z-Index: Ctrl+] bring forward, Ctrl+[ send backward ---
            if (ctrl && key === ']' && ids.length > 0) { e.preventDefault(); changeZIndex(ids, 1); return; }
            if (ctrl && key === '[' && ids.length > 0) { e.preventDefault(); changeZIndex(ids, -1); return; }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [
        undo, redo, canUndo, canRedo,
        selectAll, deselect,
        copyElements, pasteElements,
        bulkDelete, deleteElement,
        bulkMoveCommit, changeZIndex,
        getActiveIds, previewMode, onExport,
    ]);
}
