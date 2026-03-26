import { useDraggable } from '@dnd-kit/core';
import { COMPONENT_CATEGORIES, ICON_MAP } from '../../data/ComponentRegistry';
import FontManager from './FontManager';
import './ComponentSidebar.css';

function DraggableChip({ component }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `chip-${component.type}-${component.label}`,
        data: {
            type: component.type,
            label: component.label,
            defaultProps: component.defaultProps,
            defaultStyle: component.defaultStyle,
        },
    });

    const IconComp = ICON_MAP[component.icon];

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`comp-chip ${isDragging ? 'comp-chip--dragging' : ''}`}
        >
            <span className="comp-chip-icon">
                {IconComp ? <IconComp size={14} /> : '▣'}
            </span>
            <span className="comp-chip-label">{component.label}</span>
            <span className="comp-chip-drag">⋮⋮</span>
        </div>
    );
}

export default function ComponentSidebar() {
    return (
        <aside className="comp-sidebar">
            <div className="sidebar-header">
                <span className="sidebar-title">COMPONENTS</span>
                <span className="sidebar-hint">Drag to canvas</span>
            </div>

            <div className="comp-list">
                {COMPONENT_CATEGORIES.map(cat => (
                    <div key={cat.name} className="comp-category">
                        <div className="comp-category-label">{cat.name}</div>
                        {cat.components.map(comp => (
                            <DraggableChip key={comp.type + comp.label} component={comp} />
                        ))}
                    </div>
                ))}
            </div>

            {/* Custom font manager at the bottom of the sidebar */}
            <FontManager />
        </aside>
    );
}
