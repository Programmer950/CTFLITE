import { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { ANIMATIONS } from '../../data/Animations';
import './PropertiesPanel.css';

const SYSTEM_FONTS = ['Orbitron', 'JetBrains Mono', 'Rajdhani', 'Arial', 'Georgia', 'Courier New'];
const ANIMATION_OPTIONS = ['none', 'fadeIn', 'slideInLeft', 'slideInRight', 'glowPulse', 'glitch', 'flicker', 'bouncePop'];

function useFontList() {
    const { customFonts } = useBuilder();
    return [...SYSTEM_FONTS, ...customFonts.map(f => f.name)];
}

export default function PropertiesPanel() {
    const { selectedElement, selectedElements, selectedIds, updateElement, deselect, bulkUpdate, bulkDelete, changeZIndex } = useBuilder();
    const [tab, setTab] = useState('content');

    // Multi-select panel
    if (selectedIds.length > 1) {
        return (
            <aside className="props-panel">
                <div className="props-header">
                    <span className="props-title">PROPERTIES</span>
                    <span className="props-elem-name">{selectedIds.length} selected</span>
                    <button className="props-close" onClick={deselect}>✕</button>
                </div>
                <MultiSelectPanel
                    selectedIds={selectedIds}
                    bulkUpdate={bulkUpdate}
                    bulkDelete={bulkDelete}
                    changeZIndex={changeZIndex}
                    deselect={deselect}
                />
            </aside>
        );
    }

    if (!selectedElement) {
        return (
            <aside className="props-panel">
                <div className="props-header">
                    <span className="props-title">PROPERTIES</span>
                </div>
                <div className="props-empty">
                    <div className="props-empty-icon">◈</div>
                    <p>Select an element<br />to edit its properties</p>
                </div>
            </aside>
        );
    }

    const { props = {}, style = {}, label } = selectedElement;

    const updateProp = (key, val) => updateElement(selectedElement.id, { props: { [key]: val } });
    const updateStyle = (key, val) => updateElement(selectedElement.id, { style: { [key]: val } });

    return (
        <aside className="props-panel">
            <div className="props-header">
                <span className="props-title">PROPERTIES</span>
                <span className="props-elem-name">{label}</span>
                <button className="props-close" onClick={deselect}>✕</button>
            </div>

            <div className="props-tabs">
                {['content', 'style', 'animation', 'layout'].map(t => (
                    <button key={t} className={`props-tab ${tab === t ? 'props-tab--active' : ''}`} onClick={() => setTab(t)}>
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="props-body">
                {tab === 'content' && <ContentTab el={selectedElement} updateProp={updateProp} />}
                {tab === 'style' && <StyleTab props={props} updateProp={updateProp} />}
                {tab === 'animation' && <AnimationTab props={props} updateProp={updateProp} />}
                {tab === 'layout' && <LayoutTab style={style} updateStyle={updateStyle} />}
            </div>
        </aside>
    );
}

/* ── Multi-Select Panel ── */
function MultiSelectPanel({ selectedIds, bulkUpdate, bulkDelete, changeZIndex, deselect }) {
    const [sharedColor, setSharedColor] = useState('#00ff88');
    const [sharedAnim, setSharedAnim] = useState('none');

    return (
        <div className="props-body">
            <div className="multi-select-banner">
                <span className="multi-select-count">✦ {selectedIds.length} elements selected</span>
                <p className="multi-select-hint">Hold Shift to add/remove elements. Drag any selected element to move all.</p>
            </div>

            <div className="props-fields">
                <Field label="Apply Color">
                    <div className="color-row">
                        <input type="color" className="color-picker" value={sharedColor}
                            onChange={e => setSharedColor(e.target.value)} />
                        <input className="prop-input" value={sharedColor}
                            onChange={e => setSharedColor(e.target.value)} />
                        <button className="prop-apply-btn"
                            onClick={() => bulkUpdate(selectedIds, { props: { color: sharedColor } })}>
                            Apply
                        </button>
                    </div>
                </Field>

                <Field label="Apply Animation">
                    <div style={{ display: 'flex', gap: 6 }}>
                        <select className="prop-select" value={sharedAnim}
                            onChange={e => setSharedAnim(e.target.value)}>
                            {ANIMATION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <button className="prop-apply-btn"
                            onClick={() => bulkUpdate(selectedIds, { props: { animation: sharedAnim } })}>
                            Apply
                        </button>
                    </div>
                </Field>

                <Field label="Z-Index">
                    <div className="prop-btn-group">
                        <button className="prop-btn-opt" onClick={() => changeZIndex(selectedIds, 1)}>▲ Fwd</button>
                        <button className="prop-btn-opt" onClick={() => changeZIndex(selectedIds, -1)}>▼ Back</button>
                    </div>
                </Field>
            </div>

            <div className="multi-select-actions">
                <button className="multi-delete-btn" onClick={() => bulkDelete(selectedIds)}>
                    🗑 Delete All ({selectedIds.length})
                </button>
                <button className="multi-deselect-btn" onClick={deselect}>
                    Deselect All
                </button>
            </div>
        </div>
    );
}

/* ── Content Tab ── */
function ContentTab({ el, updateProp }) {
    const { type, props = {} } = el;
    const fonts = useFontList();

    if (type === 'text') return (
        <div className="props-fields">
            <Field label="Content">
                <textarea className="prop-textarea" value={props.content || ''} onChange={e => updateProp('content', e.target.value)} rows={4} />
            </Field>
            <Field label="Font Family">
                <select className="prop-select" value={props.fontFamily || 'Rajdhani'} onChange={e => updateProp('fontFamily', e.target.value)}>
                    {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </Field>
            <Field label="Font Size">
                <SizeSlider value={props.fontSize} onChange={v => updateProp('fontSize', v)} min={10} max={80} unit="px" />
            </Field>
            <Field label="Font Weight">
                <select className="prop-select" value={props.fontWeight || '400'} onChange={e => updateProp('fontWeight', e.target.value)}>
                    {['300', '400', '500', '600', '700', '900'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
            </Field>
            <Field label="Letter Spacing">
                <SizeSlider value={props.letterSpacing} onChange={v => updateProp('letterSpacing', v)} min={0} max={20} unit="px" />
            </Field>
            <Field label="Line Height">
                <SizeSlider value={props.lineHeight} onChange={v => updateProp('lineHeight', v)} min={1} max={3} unit="" step={0.1} />
            </Field>
            <Field label="Text Align">
                <div className="prop-btn-group">
                    {['left', 'center', 'right'].map(a => (
                        <button key={a} className={`prop-btn-opt ${props.textAlign === a ? 'active' : ''}`} onClick={() => updateProp('textAlign', a)}>{a}</button>
                    ))}
                </div>
            </Field>
        </div>
    );

    if (type === 'button') return (
        <div className="props-fields">
            <Field label="Button Text">
                <input className="prop-input" value={props.text || ''} onChange={e => updateProp('text', e.target.value)} />
            </Field>
            <Field label="Font Family">
                <select className="prop-select" value={props.fontFamily || 'Orbitron'} onChange={e => updateProp('fontFamily', e.target.value)}>
                    {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </Field>
            <Field label="Font Size">
                <SizeSlider value={props.fontSize} onChange={v => updateProp('fontSize', v)} min={10} max={28} unit="px" />
            </Field>
            <Field label="Letter Spacing">
                <SizeSlider value={props.letterSpacing} onChange={v => updateProp('letterSpacing', v)} min={0} max={12} unit="px" />
            </Field>
            <Field label="Padding">
                <input className="prop-input" value={props.padding || ''} onChange={e => updateProp('padding', e.target.value)} placeholder="12px 24px" />
            </Field>
            <Field label="Border Radius">
                <SizeSlider value={props.borderRadius} onChange={v => updateProp('borderRadius', v)} min={0} max={50} unit="px" />
            </Field>
        </div>
    );

    if (type === 'input') return (
        <div className="props-fields">
            <Field label="Label Text">
                <input className="prop-input" value={props.label || ''} onChange={e => updateProp('label', e.target.value)} />
            </Field>
            <Field label="Placeholder">
                <input className="prop-input" value={props.placeholder || ''} onChange={e => updateProp('placeholder', e.target.value)} />
            </Field>
            <Field label="Input Type">
                <select className="prop-select" value={props.inputType || 'text'} onChange={e => updateProp('inputType', e.target.value)}>
                    {['text', 'email', 'password', 'number', 'tel', 'url'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </Field>
        </div>
    );

    if (type === 'badge') return (
        <div className="props-fields">
            <Field label="Badge Text">
                <input className="prop-input" value={props.text || ''} onChange={e => updateProp('text', e.target.value)} />
            </Field>
            <Field label="Letter Spacing">
                <SizeSlider value={props.letterSpacing} onChange={v => updateProp('letterSpacing', v)} min={0} max={10} unit="px" />
            </Field>
        </div>
    );

    if (type === 'countdown') return (
        <div className="props-fields">
            <Field label="Label">
                <input className="prop-input" value={props.label || ''} onChange={e => updateProp('label', e.target.value)} />
            </Field>
            <Field label="Target Date">
                <input className="prop-input" type="datetime-local"
                    value={props.targetDate ? props.targetDate.slice(0, 16) : ''}
                    onChange={e => updateProp('targetDate', new Date(e.target.value).toISOString())}
                    style={{ colorScheme: 'dark' }}
                />
            </Field>
        </div>
    );

    if (type === 'navbar') return (
        <div className="props-fields">
            <Field label="Brand Name">
                <input className="prop-input" value={props.brand || ''} onChange={e => updateProp('brand', e.target.value)} />
            </Field>
        </div>
    );

    if (type === 'image') return (
        <div className="props-fields">
            <Field label="Image URL">
                <input className="prop-input" value={props.src || ''} onChange={e => updateProp('src', e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Alt Text">
                <input className="prop-input" value={props.alt || ''} onChange={e => updateProp('alt', e.target.value)} />
            </Field>
        </div>
    );

    return <div className="props-empty"><p>No content settings for this element.</p></div>;
}

/* ── Style Tab ── */
function StyleTab({ props, updateProp }) {
    return (
        <div className="props-fields">
            <Field label="Text / Main Color">
                <ColorRow value={props.color} onChange={v => updateProp('color', v)} />
            </Field>
            {props.gradient !== undefined && (
                <Field label="Gradient">
                    <input className="prop-input" value={props.gradient || ''} onChange={e => updateProp('gradient', e.target.value)} placeholder="linear-gradient(...)" />
                </Field>
            )}
            {props.background !== undefined && (
                <Field label="Background">
                    <input className="prop-input" value={props.background || ''} onChange={e => updateProp('background', e.target.value)} placeholder="rgba(...)" />
                </Field>
            )}
            {props.borderColor !== undefined && (
                <Field label="Border / Focus Color">
                    <ColorRow value={props.borderColor?.replace?.(/[^#0-9a-fA-F]/g, '').length === 6 ? `#${props.borderColor.replace(/[^#0-9a-fA-F]/g, '')}` : '#00ff88'} onChange={v => updateProp('borderColor', v)} />
                </Field>
            )}
            {props.hoverGlow !== undefined && (
                <Field label="Hover Glow Color">
                    <ColorRow value={props.hoverGlow} onChange={v => updateProp('hoverGlow', v)} />
                </Field>
            )}
            {props.borderRadius !== undefined && (
                <Field label="Border Radius">
                    <SizeSlider value={props.borderRadius} onChange={v => updateProp('borderRadius', v)} min={0} max={50} unit="px" />
                </Field>
            )}
        </div>
    );
}

/* ── Animation Tab ── */
function AnimationTab({ props, updateProp }) {
    return (
        <div className="props-fields">
            <Field label="Animation">
                <select className="prop-select" value={props.animation || 'none'} onChange={e => updateProp('animation', e.target.value)}>
                    {ANIMATION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </Field>
            <div className="anim-preview-grid">
                {ANIMATION_OPTIONS.filter(a => a !== 'none').map(a => (
                    <button key={a} className={`anim-chip ${props.animation === a ? 'anim-chip--active' : ''}`}
                        onClick={() => updateProp('animation', a)}>
                        {a}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ── Layout Tab ── */
function LayoutTab({ style, updateStyle }) {
    return (
        <div className="props-fields">
            <Field label="Width">
                <input className="prop-input" value={style.width || ''} onChange={e => updateStyle('width', e.target.value)} placeholder="300px or 50%" />
            </Field>
            <Field label="Min Height">
                <input className="prop-input" value={style.minHeight || ''} onChange={e => updateStyle('minHeight', e.target.value)} placeholder="200px" />
            </Field>
            <Field label="Left (X)">
                <input className="prop-input" value={style.left || ''} onChange={e => updateStyle('left', e.target.value)} placeholder="120px" />
            </Field>
            <Field label="Top (Y)">
                <input className="prop-input" value={style.top || ''} onChange={e => updateStyle('top', e.target.value)} placeholder="80px" />
            </Field>
            <Field label="Z-Index">
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input className="prop-input" type="number" value={parseInt(style.zIndex) || 1}
                        onChange={e => updateStyle('zIndex', parseInt(e.target.value))}
                        style={{ flex: 1 }} />
                    <button className="prop-btn-opt" onClick={() => updateStyle('zIndex', (parseInt(style.zIndex) || 1) + 1)}>▲</button>
                    <button className="prop-btn-opt" onClick={() => updateStyle('zIndex', Math.max(1, (parseInt(style.zIndex) || 1) - 1))}>▼</button>
                </div>
            </Field>
        </div>
    );
}

/* ── Helpers ── */
function Field({ label, children }) {
    return (
        <div className="prop-field">
            <label className="prop-field-label">{label}</label>
            {children}
        </div>
    );
}

function ColorRow({ value, onChange }) {
    const safeColor = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#00ff88';
    return (
        <div className="color-row">
            <input type="color" className="color-picker" value={safeColor} onChange={e => onChange(e.target.value)} />
            <input className="prop-input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#00ff88" />
        </div>
    );
}

function SizeSlider({ value, onChange, min = 0, max = 100, unit = 'px', step = 1 }) {
    const num = parseFloat(value) || min;
    return (
        <div className="size-row">
            <input type="range" className="size-slider" min={min} max={max} step={step} value={num}
                onChange={e => onChange(unit ? `${e.target.value}${unit}` : e.target.value)} />
            <span className="size-val">{value || `${min}${unit}`}</span>
        </div>
    );
}
