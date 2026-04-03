import { useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { useContextMenu } from '../builder/BuilderLayout';
import {
    ButtonElement, InputElement, TextElement, CardElement,
    CountdownElement, BadgeElement, ImageElement, SpacerElement,
    DividerElement, NavBarElement,
} from './Elements';
import { Trash2, GripVertical } from 'lucide-react';
import './ElementRenderer.css';

const ELEMENT_MAP = {
    button: ButtonElement,
    input: InputElement,
    text: TextElement,
    card: CardElement,
    countdown: CountdownElement,
    badge: BadgeElement,
    image: ImageElement,
    spacer: SpacerElement,
    divider: DividerElement,
    navbar: NavBarElement,
};

export default function ElementRenderer({ element, isPreview = false }) {
    const onContextMenu = useContextMenu();
    const {
        selectedId, selectedIds,
        selectElement, toggleSelect, deleteElement,
        moveElement, bulkMove, bulkMoveCommit,
        previewMode,
    } = useBuilder();

    const isSelected = selectedIds.includes(element.id);
    const isPrimary = selectedId === element.id;
    const isMultiSelect = selectedIds.length > 1;
    const dragStartRef = useRef(null);

    const Comp = ELEMENT_MAP[element.type];
    if (!Comp) return null;

    const { style = {}, props = {} } = element;

    const wrapperStyle = {
        position: element.type === 'navbar' ? 'fixed' : 'absolute',
        left: style.left || 'auto',
        top: style.top || 'auto',
        width: style.width || 'auto',
        minHeight: style.minHeight || undefined,
        height: style.height || undefined,
        transform: style.transform || undefined,
        zIndex: isSelected ? (Number(style.zIndex || 1) + 1000) : (style.zIndex || 1),
        cursor: isPreview || previewMode ? 'default' : 'pointer',
        userSelect: 'none',
    };

    if (isPreview || previewMode) {
        return (
            <div style={wrapperStyle} data-el-id={element.id}>
                <Comp props={props} />
            </div>
        );
    }

    const handleMouseDown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        e.stopPropagation();

        // Shift+click → multi-select toggle
        if (e.shiftKey) {
            toggleSelect(element.id);
            return;
        }

        // Regular click selects only this element
        selectElement(element.id);

        const startX = e.clientX;
        const startY = e.clientY;

        // Gather initial positions of all selected elements (or just this one)
        const idsToMove = isSelected && isMultiSelect
            ? selectedIds
            : [element.id];

        const startLeft = parseInt(style.left) || 0;
        const startTop = parseInt(style.top) || 0;
        const isPixel = !String(style.left).includes('%') && !String(style.top).includes('%');
        if (!isPixel) return;

        dragStartRef.current = { startX, startY, startLeft, startTop, moved: false, idsToMove };

        const onMove = (me) => {
            if (!dragStartRef.current) return;
            const dx = me.clientX - dragStartRef.current.startX;
            const dy = me.clientY - dragStartRef.current.startY;
            dragStartRef.current.moved = true;

            if (dragStartRef.current.idsToMove.length > 1) {
                bulkMove(dragStartRef.current.idsToMove, dx, dy);
                // Reset startX/Y after each move to do incremental moves
                dragStartRef.current.startX = me.clientX;
                dragStartRef.current.startY = me.clientY;
            } else {
                moveElement(element.id, `${startLeft + dx}px`, `${startTop + dy}px`);
            }
        };

        const onUp = () => {
            dragStartRef.current = null;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSelected) selectElement(element.id);
        if (onContextMenu) onContextMenu(e, element.id);
    };

    return (
        <div
            data-el-id={element.id}
            className={`el-wrapper ${isSelected ? 'el-wrapper--selected' : ''} ${isSelected && !isPrimary ? 'el-wrapper--secondary' : ''}`}
            style={wrapperStyle}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
                e.stopPropagation();
                if (e.shiftKey) toggleSelect(element.id);
                else selectElement(element.id);
            }}
            onContextMenu={handleContextMenu}
        >
            <Comp props={props} isSelected={isSelected} />

            {isSelected && (
                <>
                    {/* Selection border label */}
                    <div className="el-selection-label">
                        {element.label || element.type}
                        {isMultiSelect && isPrimary && <span className="el-multi-badge">+{selectedIds.length - 1}</span>}
                    </div>
                    {/* Delete button */}
                    <button
                        className="el-delete-btn"
                        onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
                    >
                        <Trash2 size={12} />
                    </button>
                    {/* Drag handle indicator */}
                    <div className="el-drag-handle">
                        <GripVertical size={12} />
                    </div>
                </>
            )}
        </div>
    );
}
