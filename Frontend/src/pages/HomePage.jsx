import { useState, useEffect } from "react";
import { componentMap } from "../components/componentMap";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";
import {
    fetchChallenges,
    fetchScoreboard,
    fetchMe,
    fetchStats,
    fetchCategories
} from "../api/api";

import {
    DndContext,
    closestCenter,
    DragOverlay
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* ---------------- SORTABLE ITEM ---------------- */

function SortableItem({ id, children, isBuilder }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: "100%",
        boxSizing: "border-box",
        opacity: isDragging ? 0.4 : 1   // 🔥 ghost effect
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`section-wrapper ${isDragging ? "dragging" : ""}`}
        >
            {isBuilder && (
                <div className="drag-handle" {...attributes} {...listeners}>
                    ☰
                </div>
            )}
            {children}
        </div>
    );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function HomePage({
                                     page = "home",
                                     isBuilder = false,
                                     selectedIndex,
                                     setSelectedIndex,
                                     setPanelType
                                 }) {
    const { config, setConfig } = useConfig();
    const { token } = useAuth();

    const [activeId, setActiveId] = useState(null);

    const [stats, setStats] = useState(null);
    const [categories, setCategories] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [scoreboard, setScoreboard] = useState([]);
    const [me, setMe] = useState(null);

    const sections = config?.pages?.[page]?.sections || [];

    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                const [c, s, m, st, cat] = await Promise.all([
                    fetchChallenges(token),
                    fetchScoreboard(token),
                    fetchMe(token),
                    fetchStats(token),
                    fetchCategories(token)
                ]);

                setChallenges(c || []);
                setScoreboard(s || []);
                setMe(m || null);
                setStats(st || null);
                setCategories(cat || []);
            } catch (err) {
                console.error("API error:", err);
            }
        };

        load();
    }, [token]);

    /* ---------------- DRAG ---------------- */

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);

        if (!isBuilder) return;

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newSections = arrayMove(sections, oldIndex, newIndex);

        setConfig((prev) => ({
            ...prev,
            pages: {
                ...prev.pages,
                [page]: {
                    ...prev.pages[page],
                    sections: newSections
                }
            }
        }));
    };

    /* ---------------- USER MODE ---------------- */

    if (!isBuilder) {
        return (
            <div className="page-wrapper">
                {sections.map((section) => {
                    if (!section.enabled) return null;

                    const Component = componentMap[section.type];
                    if (!Component) return null;

                    return (
                        <div key={section.id} className="section-wrapper">
                            <Component
                                {...section.props}
                                challenges={challenges}
                                scoreboard={scoreboard}
                                me={me}
                                stats={stats}
                                categories={categories}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }

    /* ---------------- BUILDER MODE ---------------- */

    const activeSection = sections.find((s) => s.id === activeId);
    const ActiveComponent = activeSection
        ? componentMap[activeSection.type]
        : null;

    return (
        <div className="page-wrapper builder-mode">
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sections.map((section, index) => {
                        if (!section.enabled) return null;

                        const Component = componentMap[section.type];
                        if (!Component) return null;

                        return (
                            <SortableItem key={section.id} id={section.id} isBuilder>
                                {/* CLICK */}
                                <div
                                    className="section-overlay"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex(index);
                                        setPanelType("widget");
                                    }}
                                />

                                {/* COMPONENT */}
                                <Component
                                    {...section.props}
                                    challenges={challenges}
                                    scoreboard={scoreboard}
                                    me={me}
                                    stats={stats}
                                    categories={categories}
                                />

                                {/* BORDER */}
                                {selectedIndex === index && (
                                    <div className="section-selected-border" />
                                )}

                                {/* DELETE */}
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        if (!window.confirm("Delete this section?")) return;

                                        const updatedSections = sections.filter(
                                            (_, i) => i !== index
                                        );

                                        setConfig((prev) => ({
                                            ...prev,
                                            pages: {
                                                ...prev.pages,
                                                [page]: {
                                                    ...prev.pages[page],
                                                    sections: updatedSections
                                                }
                                            }
                                        }));

                                        setSelectedIndex(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </SortableItem>
                        );
                    })}
                </SortableContext>

                {/* 🔥 DRAG OVERLAY FIX */}
                <DragOverlay>
                    {ActiveComponent ? (
                        <div className="drag-overlay">
                            <ActiveComponent
                                {...activeSection.props}
                                challenges={challenges}
                                scoreboard={scoreboard}
                                me={me}
                                stats={stats}
                                categories={categories}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}