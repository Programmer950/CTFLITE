import { useState, useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilder } from '../../context/BuilderContext';
import ElementRenderer from '../elements/ElementRenderer';
import { MatrixBackground } from '../shared/MatrixBackground';
import './Canvas.css';

const VIEWPORT_WIDTHS = { desktop: '100%', tablet: '768px', mobile: '390px' };

export default function Canvas() {
    const { currentPage, viewport, deselect, previewMode, selectMany } = useBuilder();
    const canvasRef = useRef(null);

    // Register the drop zone for dnd-kit
    const { isOver, setNodeRef: setDropRef } = useDroppable({ id: 'canvas-drop-zone' });

    // Marquee selection state
    const [marquee, setMarquee] = useState(null); // {x, y, w, h} in canvas coords
    const marqueeStart = useRef(null);
    const isDraggingMarquee = useRef(false);

    const bgStyle = currentPage?.background?.type === 'gradient'
        ? { background: currentPage.background.value }
        : { background: currentPage?.background?.value || '#050508' };

    // Combine dnd-kit's ref and our own canvasRef
    const setRefs = useCallback((el) => {
        setDropRef(el);
        canvasRef.current = el;
    }, [setDropRef]);

    const handleCanvasMouseDown = useCallback((e) => {
        // Only start marquee on the canvas surface itself (not on child elements)
        if (e.target !== canvasRef.current && !e.target.classList.contains('matrix-canvas')) return;
        if (previewMode) return;

        deselect();

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x0 = e.clientX - rect.left;
        const y0 = e.clientY - rect.top;
        marqueeStart.current = { x0, y0 };
        isDraggingMarquee.current = false;

        const onMove = (me) => {
            const x1 = me.clientX - rect.left;
            const y1 = me.clientY - rect.top;
            isDraggingMarquee.current = true;
            setMarquee({
                x: Math.min(x0, x1),
                y: Math.min(y0, y1),
                w: Math.abs(x1 - x0),
                h: Math.abs(y1 - y0),
            });
        };

        const onUp = (me) => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);

            if (isDraggingMarquee.current && marqueeStart.current) {
                const x1 = me.clientX - rect.left;
                const y1 = me.clientY - rect.top;
                const selX = Math.min(marqueeStart.current.x0, x1);
                const selY = Math.min(marqueeStart.current.y0, y1);
                const selW = Math.abs(x1 - marqueeStart.current.x0);
                const selH = Math.abs(y1 - marqueeStart.current.y0);

                // Find all overlapping elements
                if (selW > 4 && selH > 4) {
                    const overlapping = [];
                    const allWrappers = canvasRef.current?.querySelectorAll('[data-el-id]') || [];
                    allWrappers.forEach((el) => {
                        const elRect = el.getBoundingClientRect();
                        const elX = elRect.left - rect.left;
                        const elY = elRect.top - rect.top;
                        if (
                            elX < selX + selW &&
                            elX + elRect.width > selX &&
                            elY < selY + selH &&
                            elY + elRect.height > selY
                        ) {
                            overlapping.push(el.dataset.elId);
                        }
                    });
                    if (overlapping.length > 0) selectMany(overlapping);
                }
            }

            setMarquee(null);
            marqueeStart.current = null;
            isDraggingMarquee.current = false;
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [previewMode, deselect, selectMany]);

    return (
        <div className="canvas-outer">
            <div
                className={`canvas-area ${isOver ? 'canvas-area--over' : ''}`}
                style={{ width: VIEWPORT_WIDTHS[viewport] || '100%' }}
            >
                <div
                    ref={setRefs}
                    className="canvas-surface"
                    style={bgStyle}
                    onMouseDown={handleCanvasMouseDown}
                >
                    {/* Matrix grid background */}
                    <MatrixBackground />

                    {/* Page elements */}
                    {currentPage?.elements?.map((el) => (
                        <ElementRenderer key={el.id} element={el} isPreview={previewMode} />
                    ))}

                    {/* Marquee selection rectangle */}
                    {marquee && (
                        <div
                            className="canvas-marquee"
                            style={{
                                left: marquee.x,
                                top: marquee.y,
                                width: marquee.w,
                                height: marquee.h,
                            }}
                        />
                    )}

                    {/* Drop indicator */}
                    {isOver && (
                        <div className="canvas-drop-indicator">
                            <span>DROP HERE</span>
                        </div>
                    )}

                    {/* Empty state — full welcome screen */}
                    {!currentPage?.elements?.length && !isOver && !previewMode && !marquee && (
                        <div className="canvas-welcome">
                            <div className="canvas-welcome-glow" />
                            <div className="canvas-welcome-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </div>
                            <h2 className="canvas-welcome-title">Start building your page</h2>
                            <p className="canvas-welcome-sub">Blank canvas — completely yours. Pick how you want to start:</p>

                            <div className="canvas-welcome-cards">
                                <div className="canvas-welcome-card">
                                    <div className="cwc-icon">◫</div>
                                    <div className="cwc-title">Drag &amp; Drop</div>
                                    <div className="cwc-desc">Pick any component from the <strong>left sidebar</strong> and drag it here</div>
                                </div>
                                <div className="canvas-welcome-card">
                                    <div className="cwc-icon">🤖</div>
                                    <div className="cwc-title">AI Builder</div>
                                    <div className="cwc-desc">Click <strong>AI BUILD</strong> in the toolbar and describe your page in plain English</div>
                                </div>
                                <div className="canvas-welcome-card">
                                    <div className="cwc-icon">⌨</div>
                                    <div className="cwc-title">Keyboard</div>
                                    <div className="cwc-desc"><strong>Ctrl+Z</strong> undo &nbsp;·&nbsp; <strong>Ctrl+C/V</strong> copy/paste &nbsp;·&nbsp; <strong>Del</strong> remove</div>
                                </div>
                            </div>

                            <div className="canvas-welcome-tips">
                                <span>💡 Right-click on any element for context menu</span>
                                <span>💡 Shift+Click for multi-select &nbsp;·&nbsp; Drag to marquee-select</span>
                                <span>💡 Double-click a page tab in the sidebar to rename it</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
