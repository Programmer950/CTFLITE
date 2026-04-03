/**
 * designEngine.js
 * Comprehensive local design command parser — no API needed.
 * Handles 40+ command categories with compound-command splitting.
 */
import { v4 as uuidv4 } from 'uuid';

// ── Color & Gradient Dictionaries ─────────────────────────────────────────────
const COLORS = {
    red: '#ff3864', crimson: '#dc143c', coral: '#ff6b6b', pink: '#ff69b4', rose: '#ff007f',
    blue: '#00e5ff', cyan: '#00e5ff', teal: '#00b8cc', navy: '#001f3f', sky: '#87ceeb', cobalt: '#0047ab',
    green: '#00ff88', lime: '#39ff14', emerald: '#00c878', mint: '#3eb489', sage: '#77a878',
    purple: '#9d4edd', violet: '#7c3aed', lavender: '#b57bee', magenta: '#ff00ff', fuchsia: '#f0f',
    orange: '#ff6b00', amber: '#ffa500', peach: '#ffb347',
    yellow: '#ffd700', gold: '#ffd700',
    white: '#ffffff', cream: '#fffdd0',
    black: '#050508', charcoal: '#1a1a2e', dark: '#0a0a14',
    gray: '#4a5568', silver: '#c0c0c0', slate: '#334155',
};

const GRADIENTS = {
    purple: 'linear-gradient(135deg,#0a0010 0%,#1a0030 50%,#050508 100%)',
    violet: 'linear-gradient(135deg,#0a0010 0%,#1a0030 50%,#050508 100%)',
    red: 'linear-gradient(135deg,#1a0005 0%,#2d0010 40%,#050508 100%)',
    crimson: 'linear-gradient(135deg,#1a0005 0%,#2d0010 40%,#050508 100%)',
    blue: 'linear-gradient(135deg,#001520 0%,#002244 40%,#050508 100%)',
    cyan: 'linear-gradient(135deg,#001a1a 0%,#003333 40%,#050508 100%)',
    teal: 'linear-gradient(135deg,#001a1a 0%,#003333 40%,#050508 100%)',
    green: 'linear-gradient(135deg,#001a0a 0%,#002d15 40%,#050508 100%)',
    orange: 'linear-gradient(135deg,#1a0800 0%,#2d1400 40%,#050508 100%)',
    nebula: 'linear-gradient(135deg,#0d0221 0%,#1a0a3d 30%,#000d1a 70%,#050508 100%)',
    galaxy: 'linear-gradient(135deg,#020024 0%,#090979 35%,#00adff 100%)',
    fire: 'linear-gradient(135deg,#1a0000 0%,#ff3300 50%,#ff8800 100%)',
    sunset: 'linear-gradient(135deg,#1a0010 0%,#9d4edd 40%,#ff6b00 100%)',
    ocean: 'linear-gradient(135deg,#000d1a 0%,#003366 40%,#00b8cc 100%)',
    matrix: 'linear-gradient(135deg,#000a00 0%,#001a00 50%,#050508 100%)',
    gold: 'linear-gradient(135deg,#1a1000 0%,#3a2000 50%,#050508 100%)',
    midnight: 'linear-gradient(135deg,#000010 0%,#000033 50%,#020205 100%)',
    dusk: 'linear-gradient(135deg,#0a0020 0%,#200040 40%,#400010 100%)',
};

const FONTS = {
    orbitron: 'Orbitron', futuristic: 'Orbitron', tech: 'Orbitron', scifi: 'Orbitron', retro: 'Orbitron',
    mono: 'JetBrains Mono', jetbrains: 'JetBrains Mono', monospace: 'JetBrains Mono', code: 'JetBrains Mono',
    rajdhani: 'Rajdhani', clean: 'Rajdhani', readable: 'Rajdhani', minimal: 'Rajdhani',
    roboto: 'Roboto', modern: 'Roboto', inter: 'Inter', sans: 'Inter',
    arial: 'Arial', helvetica: 'Arial', system: 'Arial',
};

const ANIMS = {
    glow: 'glowPulse', pulse: 'glowPulse', neon: 'glowPulse', shiny: 'glowPulse',
    glitch: 'glitch', corrupt: 'glitch', hack: 'glitch', digital: 'glitch',
    flicker: 'flicker', blink: 'flicker', strobe: 'flicker',
    bounce: 'bouncePop', pop: 'bouncePop', spring: 'bouncePop', elastic: 'bouncePop',
    shake: 'shake', vibrate: 'shake', tremble: 'shake',
    fade: 'fadeIn', appear: 'fadeIn', 'fade in': 'fadeIn',
    slide: 'slideInLeft', 'slide in': 'slideInLeft', enter: 'slideInLeft',
    float: 'glowPulse',
};

// ── Extraction helpers ────────────────────────────────────────────────────────
const getColor = (d) => { for (const [n, h] of Object.entries(COLORS)) if (d.includes(n)) return h; const m = d.match(/#[0-9a-f]{3,6}/i); return m ? m[0] : null; };
const getGrad = (d) => { for (const [n, g] of Object.entries(GRADIENTS)) if (d.includes(n)) return { type: 'gradient', value: g }; return null; };
const getFont = (d) => { for (const [n, f] of Object.entries(FONTS)) if (d.includes(n)) return f; return null; };
const getAnim = (d) => { for (const [n, a] of Object.entries(ANIMS)) if (d.includes(n)) return a; return null; };
const getPx = (d) => { const m = d.match(/(\d+(?:\.\d+)?)\s*px/); return m ? `${m[1]}px` : null; };
const getNum = (d) => { const m = d.match(/(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : null; };

// Target element types mentioned in description
const getTargets = (d) => {
    const t = [];
    if (d.match(/\b(button|btn|cta)\b/g)) t.push('button');
    if (d.match(/\b(text|heading|title|label|paragraph|para|word|font|h[1-6])\b/g)) t.push('text');
    if (d.match(/\b(input|field|textbox|entry|form|username|password|email)\b/g)) t.push('input');
    if (d.match(/\b(card|box|panel|container|section|glass|frame)\b/g)) t.push('card');
    if (d.match(/\b(badge|tag|chip|pill|label)\b/g)) t.push('badge');
    if (d.match(/\b(navbar|nav.?bar|navigation|header|nav)\b/g)) t.push('navbar');
    if (d.match(/\b(countdown|timer)\b/g)) t.push('countdown');
    return t;
};

// Quick element builder
const mkEl = (type, label, left, top, width, props, extra = {}) => ({
    id: uuidv4(), type, label,
    style: {
        left: left === 'center' ? '50%' : left,
        top: `${top}px`, width,
        transform: left === 'center' ? 'translateX(-50%)' : undefined,
        zIndex: 2, ...extra,
    },
    props,
});

// Varied success responses for natural feel
const replies = {
    bg: ['Background updated! Looking sharp.', 'Canvas refreshed with new background.', 'Done — background changed!'],
    anim: (a) => [`Added ${a} animation!`, `Elements are now ${a}.`, `${a} effect applied — looking dynamic!`],
    color: (c) => [`Color changed to ${c}!`, `All matching elements are now ${c}.`, `Theme updated to ${c}.`],
    shape: (r) => [`Corners are now ${r.includes('999') ? 'pill-shaped' : r === '3px' ? 'sharp' : 'rounded'}!`, `Shape updated!`, `Border radius set to ${r}.`],
    font: (f) => [`Font changed to ${f}.`, `Typography updated — ${f} applied!`],
    done: ['Done!', 'Applied!', 'Changes made!', 'Looking good!'],
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Single command analyser ───────────────────────────────────────────────────
function analyzeSingle(d, currentElements = []) {
    const accent = getColor(d) || '#00ff88';
    const targets = getTargets(d);
    const all5 = ['text', 'button', 'input', 'card', 'badge'];

    // ── BACKGROUND ────────────────────────────────────────────────────────────
    if (d.match(/\b(background|bg|backdrop|wallpaper|canvas.?color|page.?color)\b/)) {
        if (d.match(/\b(dark|black|night|midnight)\b/) && !getColor(d))
            return { intent: 'change_background', reply: 'Background set to deep black.', background: { type: 'solid', value: '#020205' } };
        const grad = getGrad(d);
        if (grad) return { intent: 'change_background', reply: pick(replies.bg), background: grad };
        const col = getColor(d);
        if (col) return { intent: 'change_background', reply: pick(replies.bg), background: { type: 'solid', value: col } };
        return { intent: 'change_background', reply: pick(replies.bg), background: { type: 'solid', value: '#050508' } };
    }

    // ── THEME (color across everything) ───────────────────────────────────────
    if (d.match(/\b(theme|color.?scheme|accent|palette|overall.?color|everything.?\w+color)\b/)) {
        const col = getColor(d) || '#00ff88';
        const grad = getGrad(d);
        return {
            intent: 'mixed', reply: pick(replies.color(col)),
            background: grad || undefined,
            updates: [
                { matchType: 'text', props: { color: col } },
                { matchType: 'button', props: { hoverGlow: col, gradient: `linear-gradient(135deg,${col},${col}99)` } },
                { matchType: 'badge', props: { color: col } },
                { matchType: 'navbar', props: { color: col } },
                { matchType: 'input', props: { focusColor: col, borderColor: `${col}50` } },
                { matchType: 'countdown', props: { color: col } },
            ],
        };
    }

    // ── DARK MODE ─────────────────────────────────────────────────────────────
    if (d.match(/\b(dark.?mode|night.?mode|darkmode|make.?dark|go.?dark)\b/)) {
        return {
            intent: 'mixed', reply: 'Dark mode applied!',
            background: { type: 'solid', value: '#020205' },
            updates: [
                { matchType: 'card', props: { background: 'rgba(5,5,8,0.97)' } },
                { matchType: 'text', props: { color: '#c8d6e5' } },
                { matchType: 'input', props: { borderColor: 'rgba(255,255,255,0.06)' } },
            ],
        };
    }

    // ── ANIMATION — REMOVE ────────────────────────────────────────────────────
    if (d.match(/\b(remove|stop|disable|off|no|clear|reset)\b.*\b(animation|anim|effect|glow|glitch|flicker|bounce|pulse)\b/)) {
        const types = targets.length ? targets : all5;
        return {
            intent: 'update_elements', reply: 'Animations cleared!',
            updates: types.map(t => ({ matchType: t, props: { animation: 'none' } }))
        };
    }

    // ── ANIMATION — ADD ───────────────────────────────────────────────────────
    if (d.match(/\b(glow|pulse|glitch|flicker|bounce|shake|fade|slide|float|blink|vibrate|neon.?effect|animation|animate|spin|pop|spring)\b/)) {
        let anim = getAnim(d) || 'glowPulse';
        const types = targets.length ? targets : ['text', 'button'];
        return {
            intent: 'update_elements', reply: pick(replies.anim(anim)),
            updates: types.map(t => ({ matchType: t, props: { animation: anim } }))
        };
    }

    // ── SHAPE / BORDER RADIUS ─────────────────────────────────────────────────
    if (d.match(/\b(round|rounded|pill|oval|circular|sharp|square|square|rect|no.?round|corner|radius)\b/)) {
        const isRound = d.match(/\b(round|rounded|pill|oval|circular|smooth)\b/);
        const isPill = d.includes('pill') || d.match(/fully.?round/);
        const radius = isPill ? '999px' : isRound ? (getPx(d) || '16px') : '3px';
        const types = targets.length ? targets : ['button', 'card', 'input'];
        return {
            intent: 'update_elements', reply: pick(replies.shape(radius)),
            updates: types.map(t => ({ matchType: t, props: { borderRadius: radius } }))
        };
    }

    // ── FONT FAMILY ───────────────────────────────────────────────────────────
    if (d.match(/\b(font|typeface|typography|family|face)\b/)) {
        const font = getFont(d) || 'Orbitron';
        const types = targets.length ? targets : ['text', 'button'];
        return {
            intent: 'update_elements', reply: pick(replies.font(font)),
            updates: types.map(t => ({ matchType: t, props: { fontFamily: font } }))
        };
    }

    // ── FONT WEIGHT ───────────────────────────────────────────────────────────
    if (d.match(/\b(bold|heavy|thick|thin|light|medium|semi.?bold|extra.?bold|weight)\b/)) {
        const w = d.match(/\b(bold|heavy|extra.?bold|black)\b/) ? '900'
            : d.match(/\b(semi.?bold|demi)\b/) ? '600'
                : d.match(/\b(medium|regular|normal)\b/) ? '500'
                    : d.match(/\b(thin|light|slim|skinny)\b/) ? '300' : '700';
        const types = targets.length ? targets : ['text', 'button'];
        return {
            intent: 'update_elements', reply: `Font weight set to ${w}!`,
            updates: types.map(t => ({ matchType: t, props: { fontWeight: w } }))
        };
    }

    // ── FONT SIZE ─────────────────────────────────────────────────────────────
    if (d.match(/\b(font.?size|text.?size|bigger|larger|huge|smaller|tiny|small|large|scale.?up|scale.?down|increase.?size|decrease.?size)\b/)) {
        const isBig = d.match(/\b(bigger|larger|huge|increase|large|scale.?up|more|up)\b/);
        const px = getPx(d);
        const size = px || (isBig ? '48px' : '13px');
        const types = targets.length ? targets : ['text'];
        return {
            intent: 'update_elements', reply: `Font size → ${size}!`,
            updates: types.map(t => ({ matchType: t, props: { fontSize: size } }))
        };
    }

    // ── TEXT TRANSFORM ────────────────────────────────────────────────────────
    if (d.match(/\b(uppercase|allcaps|all.?caps|lowercase|capitalize)\b/)) {
        const tx = d.match(/\b(lowercase)\b/) ? 'lowercase' : d.match(/\b(capitalize)\b/) ? 'capitalize' : 'uppercase';
        const types = targets.length ? targets : ['text', 'button'];
        return {
            intent: 'update_elements', reply: `Text transformed to ${tx}!`,
            updates: types.map(t => ({ matchType: t, props: { textTransform: tx } }))
        };
    }

    // ── TEXT ALIGN ────────────────────────────────────────────────────────────
    if (d.match(/\b(align|alignment|justify|centered?|left.?align|right.?align)\b/)) {
        const align = d.match(/\bleft\b/) ? 'left'
            : d.match(/\bright\b/) ? 'right'
                : d.match(/\bjustify\b/) ? 'justify' : 'center';
        const types = targets.length ? targets : ['text'];
        return {
            intent: 'update_elements', reply: `Text aligned ${align}!`,
            updates: types.map(t => ({ matchType: t, props: { textAlign: align } }))
        };
    }

    // ── LETTER SPACING ────────────────────────────────────────────────────────
    if (d.match(/\b(letter.?spacing|tracking|kerning|spaced?)\b/)) {
        const isBig = d.match(/\b(more|wider|bigger|increase|wide|expand|open)\b/);
        const px = getPx(d);
        const val = px || (isBig ? '6px' : '1px');
        const types = targets.length ? targets : ['text', 'badge'];
        return {
            intent: 'update_elements', reply: `Letter spacing → ${val}!`,
            updates: types.map(t => ({ matchType: t, props: { letterSpacing: val } }))
        };
    }

    // ── LINE HEIGHT ───────────────────────────────────────────────────────────
    if (d.match(/\b(line.?height|leading|line.?spacing|line.?gap)\b/)) {
        const isBig = d.match(/\b(more|bigger|double|relaxed|spacious|loose|open)\b/);
        const val = getNum(d) || (isBig ? 2 : 1.3);
        const types = targets.length ? targets : ['text'];
        return {
            intent: 'update_elements', reply: `Line height → ${val}!`,
            updates: types.map(t => ({ matchType: t, props: { lineHeight: val } }))
        };
    }

    // ── COLOR on elements ─────────────────────────────────────────────────────
    if ((d.match(/\b(colou?r|tint|paint|fill|make.*\w+color|change.*color)\b/) || getColor(d)) && !d.match(/\b(background|bg|border|shadow|glow)\b/)) {
        const col = getColor(d) || '#00ff88';
        if (!targets.length) {
            return {
                intent: 'update_elements', reply: pick(replies.color(col)), updates: [
                    { matchType: 'text', props: { color: col } },
                    { matchType: 'button', props: { hoverGlow: col, gradient: `linear-gradient(135deg,${col},${col}88)` } },
                    { matchType: 'badge', props: { color: col } },
                    { matchType: 'navbar', props: { color: col } },
                    { matchType: 'input', props: { focusColor: col, borderColor: `${col}50` } },
                ]
            };
        }
        return {
            intent: 'update_elements', reply: pick(replies.color(col)),
            updates: targets.map(t => t === 'button'
                ? { matchType: t, props: { hoverGlow: col, gradient: `linear-gradient(135deg,${col},${col}88)` } }
                : { matchType: t, props: { color: col } })
        };
    }

    // ── SHADOW / GLOW / NEON ──────────────────────────────────────────────────
    if (d.match(/\b(shadow|glow|neon|halo|aura|luminous|radiant)\b/)) {
        if (d.match(/\b(remove|no|off|none|clear|disable)\b/)) {
            return {
                intent: 'update_elements', reply: 'Shadow removed!',
                updates: (targets.length ? targets : ['card', 'button', 'text']).map(t => ({ matchType: t, props: { shadow: 'none' } }))
            };
        }
        const col = getColor(d) || '#00ff88';
        const spread = d.includes('intense') || d.includes('strong') ? 48 : d.includes('subtle') || d.includes('soft') ? 8 : 24;
        const shadow = `0 0 ${spread}px ${col}80, 0 4px ${spread * 2}px ${col}30`;
        const types = targets.length ? targets : ['card', 'button'];
        return {
            intent: 'update_elements', reply: `${d.includes('neon') ? 'Neon' : 'Glow'} shadow applied!`,
            updates: types.map(t => ({ matchType: t, props: { shadow } }))
        };
    }

    // ── BLUR / GLASSMORPHISM ──────────────────────────────────────────────────
    if (d.match(/\b(blur|frosted|glass|glassmorphism|frosted.?glass|transparent)\b/)) {
        const off = d.match(/\b(remove|no|off|none|disable|clear|solid)\b/);
        const types = targets.length ? targets : ['card'];
        return {
            intent: 'update_elements', reply: `Glass blur ${off ? 'removed' : 'applied'}!`,
            updates: types.map(t => ({ matchType: t, props: { blur: !off } }))
        };
    }

    // ── OPACITY / TRANSPARENCY ────────────────────────────────────────────────
    if (d.match(/\b(opacity|transparent|translucent|see.?through|invisible|faded?)\b/)) {
        const pct = getNum(d);
        const op = pct != null ? (pct > 1 ? pct / 100 : pct) : (d.match(/\b(full|solid|opaque)\b/) ? 1 : 0.5);
        const types = targets.length ? targets : ['card'];
        return {
            intent: 'update_elements', reply: `Opacity → ${Math.round(op * 100)}%!`,
            updates: types.map(t => ({ matchType: t, style: { opacity: op } }))
        };
    }

    // ── PADDING ───────────────────────────────────────────────────────────────
    if (d.match(/\b(padding|padded|spacious|compact|tight|inner.?space|inside.?space)\b/)) {
        const isBig = d.match(/\b(more|bigger|spacious|wider|larger|increase|generous)\b/);
        const px = getPx(d);
        const val = px || (isBig ? '40px 56px' : '8px 16px');
        const types = targets.length ? targets : ['button', 'card'];
        return {
            intent: 'update_elements', reply: `Padding ${isBig ? 'increased' : 'decreased'}!`,
            updates: types.map(t => ({ matchType: t, props: { padding: val } }))
        };
    }

    // ── BORDER ────────────────────────────────────────────────────────────────
    if (d.match(/\b(border|outline|stroke|edge)\b/)) {
        if (d.match(/\b(remove|no|off|none|hide)\b/)) {
            return {
                intent: 'update_elements', reply: 'Border removed!',
                updates: (targets.length ? targets : ['card', 'input']).map(t => ({ matchType: t, props: { borderColor: 'transparent' } }))
            };
        }
        const col = getColor(d) || '#00ff88';
        const types = targets.length ? targets : ['card', 'input'];
        return {
            intent: 'update_elements', reply: `Border changed to ${col}!`,
            updates: types.map(t => ({ matchType: t, props: { borderColor: `${col}60` } }))
        };
    }

    // ── GRADIENT on elements ──────────────────────────────────────────────────
    if (d.match(/\b(gradient)\b/) && !d.match(/\b(background|bg)\b/)) {
        const c1 = getColor(d) || '#00ff88';
        const c2 = d.includes('to') ? getColor(d.split('to')[1]) : null;
        const grad = c2 ? `linear-gradient(135deg,${c1},${c2})` : `linear-gradient(135deg,${c1},${c1}55)`;
        const types = targets.length ? targets : ['button'];
        return {
            intent: 'update_elements', reply: 'Gradient applied!',
            updates: types.map(t => ({ matchType: t, props: { gradient: grad } }))
        };
    }

    // ── WIDTH / SIZE on elements ──────────────────────────────────────────────
    if (d.match(/\b(width|wider|narrower|full.?width|half.?width|narrow)\b/)) {
        const isBig = d.match(/\b(wider|full|bigger|expand|large)\b/);
        const px = getPx(d);
        const w = px || (isBig ? '100%' : '240px');
        const types = targets.length ? targets : ['button'];
        return {
            intent: 'update_elements', reply: `Width → ${w}!`,
            updates: types.map(t => ({ matchType: t, style: { width: w } }))
        };
    }

    // ── BUTTON TEXT ───────────────────────────────────────────────────────────
    if (d.match(/\b(button|btn)\b/) && d.match(/\b(text|say|label|rename|change|rename|call)\b/)) {
        const m = d.match(/\b(?:to|say|saying|text|label|called?)\s+["']?([a-z0-9\s&!?._-]+?)["']?\s*$/i);
        if (m) return {
            intent: 'update_elements', reply: `Button text → "${m[1].toUpperCase()}"!`,
            updates: [{ matchType: 'button', props: { text: m[1].toUpperCase() } }]
        };
    }

    // ── BUTTON SIZE presets ───────────────────────────────────────────────────
    if (d.match(/\b(button|btn)\b/) && d.match(/\b(small|medium|large|big|huge|tiny|full.?width)\b/)) {
        const presets = {
            tiny: { padding: '6px 12px', fontSize: '9px' }, small: { padding: '8px 16px', fontSize: '10px' },
            medium: { padding: '12px 24px', fontSize: '12px' }, large: { padding: '16px 32px', fontSize: '14px' },
            big: { padding: '18px 36px', fontSize: '15px' }, huge: { padding: '22px 44px', fontSize: '16px' },
        };
        const key = d.match(/\b(tiny|small|medium|large|big|huge)\b/)?.[0] || 'medium';
        return {
            intent: 'update_elements', reply: `Button size → ${key}!`,
            updates: [{ matchType: 'button', props: presets[key] }]
        };
    }

    // ── ADD NAVBAR ────────────────────────────────────────────────────────────
    if (d.match(/\b(add|insert|create|put)\b.*\b(navbar|nav.?bar|navigation|header)\b/) || d.match(/\b(navbar|nav.?bar)\b.*\b(add|create)\b/)) {
        const nameM = d.match(/(?:named?|called?|brand)\s+["']?([a-z0-9\s/_:]+?)["']?\s*(?:nav|bar|$)/i);
        const brand = nameM ? nameM[1].trim().toUpperCase() : 'HACK//ARENA';
        const col = getColor(d) || '#00ff88';
        return {
            intent: 'add_elements', reply: 'Navigation bar added!', newElements: [{
                type: 'navbar', label: 'Navbar',
                style: { left: '0', top: '0px', width: '100%', zIndex: 10 },
                props: { brand, color: col },
            }]
        };
    }

    // ── ADD COUNTDOWN ─────────────────────────────────────────────────────────
    if (d.match(/\b(add|insert|create)\b.*\b(countdown|timer|clock)\b/) || d.match(/\b(countdown|timer)\b.*\b(add|create|insert)\b/)) {
        const days = parseInt(d.match(/(\d+)\s*day/)?.[1] || '7');
        const hrs = parseInt(d.match(/(\d+)\s*hr/)?.[1] || '0');
        const col = getColor(d) || '#00ff88';
        const targetDate = new Date(Date.now() + (days * 86400 + hrs * 3600) * 1000).toISOString();
        const labelM = d.match(/label\s+["']?([^"'\n]+?)["']?\s*(?:\d|$)/i);
        return {
            intent: 'add_elements', reply: `Countdown timer added (${days}d${hrs ? ` ${hrs}h` : ''})!`, newElements: [{
                type: 'countdown', label: 'Countdown',
                style: { left: '50%', top: '600px', width: '600px', transform: 'translateX(-50%)', zIndex: 2 },
                props: { targetDate, label: labelM ? labelM[1].toUpperCase() : 'EVENT STARTS IN', color: col },
            }]
        };
    }

    // ── ADD DIVIDER ───────────────────────────────────────────────────────────
    if (d.match(/\b(add|insert)\b.*\b(divider|line|separator|rule)\b/)) {
        const col = getColor(d) || 'rgba(255,255,255,0.1)';
        return {
            intent: 'add_elements', reply: 'Divider added!', newElements: [{
                type: 'divider', label: 'Divider',
                style: { left: '50%', top: '500px', width: '500px', transform: 'translateX(-50%)', zIndex: 2 },
                props: { color: col, thickness: '1px', style: 'solid' },
            }]
        };
    }

    // ── ADD BADGE ─────────────────────────────────────────────────────────────
    if (d.match(/\b(add|insert|create)\b.*\b(badge|chip|tag|label|pill)\b/) || d.match(/\b(badge|chip)\b.*\b(add|insert)\b/)) {
        const col = getColor(d) || '#00ff88';
        const textM = d.match(/(?:saying|text|with|labeled?)\s+["']?([^"'\n]+?)["']?\s*$/i);
        const text = textM ? textM[1].toUpperCase() : '◈ LIVE';
        const animM = d.match(/\b(glow|pulse|glitch)\b/);
        return {
            intent: 'add_elements', reply: `Badge added!`, newElements: [
                mkEl('badge', 'Badge', 'center', 320, '180px', { text, color: col, letterSpacing: '2px', animation: animM ? getAnim(animM[0]) : 'none' }),
            ]
        };
    }

    // ── ADD CARD ──────────────────────────────────────────────────────────────
    if (d.match(/\b(add|insert|create)\b.*\b(card|box|panel|container|glass)\b/) || d.match(/\b(card|panel)\b.*\b(add|create)\b/)) {
        const col = getColor(d) || '#00ff88';
        const isGlass = d.match(/\b(glass|frosted|blur)\b/);
        return {
            intent: 'add_elements', reply: 'Card added!', newElements: [{
                type: 'card', label: 'New Card',
                style: { left: '50%', top: '200px', width: '400px', minHeight: '200px', transform: 'translateX(-50%)', zIndex: 1 },
                props: { background: 'rgba(10,10,20,0.85)', borderColor: `${col}40`, borderRadius: '16px', blur: !!isGlass, padding: '32px 40px', shadow: `0 8px 48px ${col}15` },
            }]
        };
    }

    // ── ADD BUTTON ────────────────────────────────────────────────────────────
    if (d.match(/\b(add|insert|create)\b.*\b(button|btn|cta)\b/) || d.match(/\b(button|btn)\b.*\b(add|create)\b/)) {
        const col = getColor(d) || '#00ff88';
        const textM = d.match(/(?:saying|text|with|labeled?|called?)\s+["']?([^"'\n]+?)["']?\s*$/i);
        const btnText = textM ? textM[1].toUpperCase() : 'CLICK HERE';
        const isRound = d.match(/\b(round|pill|rounded)\b/);
        return {
            intent: 'add_elements', reply: `Button "${btnText}" added!`, newElements: [
                mkEl('button', 'Button', 'center', 500, '220px', {
                    text: btnText, fontFamily: 'Orbitron', fontSize: '13px', fontWeight: '700', letterSpacing: '2px',
                    gradient: `linear-gradient(135deg,${col},${col}99)`, color: '#050508',
                    borderRadius: isRound ? '999px' : '8px', padding: '14px 24px', hoverGlow: col,
                }),
            ]
        };
    }

    // ── ADD TEXT / HEADING ────────────────────────────────────────────────────
    if (d.match(/\b(add|insert|create)\b.*\b(text|heading|title|label|h[1-6])\b/) || d.match(/\b(heading|title)\b.*\b(add|create)\b/)) {
        const col = getColor(d) || '#00ff88';
        const textM = d.match(/(?:saying|with|called?|content)\s+["']?([^"'\n]+?)["']?\s*$/i);
        const content = textM ? textM[1].toUpperCase() : 'NEW HEADING';
        const isH1 = d.match(/\bh1\b/) || d.match(/\b(main|hero|big|large)\b/);
        return {
            intent: 'add_elements', reply: `Text "${content}" added!`, newElements: [
                mkEl('text', 'Heading', 'center', 300, '600px', {
                    content, fontFamily: 'Orbitron', fontSize: isH1 ? '48px' : '24px', fontWeight: '900',
                    color: col, animation: 'fadeIn', letterSpacing: '4px', textAlign: 'center',
                }),
            ]
        };
    }

    // ── ADD INPUT FIELD ───────────────────────────────────────────────────────
    if (d.match(/\b(add|insert|create)\b.*\b(input|field|textbox)\b/) || d.match(/\b(input|field)\b.*\b(add|create)\b/)) {
        const col = getColor(d) || '#00ff88';
        const isPass = d.includes('password') || d.includes('pass');
        const isEmail = d.includes('email');
        const type = isPass ? 'password' : isEmail ? 'email' : 'text';
        const icon = isPass ? 'lock' : isEmail ? 'mail' : 'user';
        const labelM = d.match(/(?:label|named?)\s+["']?([a-z0-9\s]+?)["']?\s*(?:input|field|$)/i);
        return {
            intent: 'add_elements', reply: `Input field added!`, newElements: [
                mkEl('input', 'Input Field', 'center', 400, '340px', {
                    inputType: type, label: labelM ? labelM[1] : type.toUpperCase(),
                    placeholder: `Enter ${isPass ? 'password' : isEmail ? 'email' : 'text'}...`,
                    icon, borderColor: `${col}40`, focusColor: col,
                }),
            ]
        };
    }

    // ── REMOVE ELEMENTS ───────────────────────────────────────────────────────
    if (d.match(/\b(remove|delete|hide|clear|erase|wipe)\b/)) {
        const rm = [];
        if (d.match(/\b(button|btn|cta)\b/)) rm.push({ matchType: 'button' });
        if (d.match(/\b(input|field|form)\b/)) rm.push({ matchType: 'input' });
        if (d.match(/\b(badge|chip|tag)\b/)) rm.push({ matchType: 'badge' });
        if (d.match(/\b(navbar|nav|header)\b/)) rm.push({ matchType: 'navbar' });
        if (d.match(/\b(countdown|timer|clock)\b/)) rm.push({ matchType: 'countdown' });
        if (d.match(/\b(divider|line|separator)\b/)) rm.push({ matchType: 'divider' });
        if (d.match(/\b(card|panel|box)\b/)) rm.push({ matchType: 'card' });
        if (d.match(/\b(text|heading|title)\b/) && !d.match(/\b(button)\b/)) rm.push({ matchType: 'text' });
        if (d.match(/\b(all|every|everything)\b/) && rm.length === 0) {
            // remove all elements
            const types = [...new Set((currentElements || []).map(e => e.type))];
            return {
                intent: 'remove_elements', reply: 'All elements removed!',
                removeMatches: types.map(t => ({ matchType: t }))
            };
        }
        if (rm.length) return { intent: 'remove_elements', reply: `${rm.map(r => r.matchType).join(', ')} removed!`, removeMatches: rm };
    }

    // ── CLEAR / RESET page ────────────────────────────────────────────────────
    if (d.match(/\b(clear.?page|reset.?page|empty.?page|blank.?page|wipe.?page|start.?fresh|start.?over)\b/)) {
        const types = [...new Set((currentElements || []).map(e => e.type))];
        return { intent: 'remove_elements', reply: 'Page cleared! Fresh canvas ready.', removeMatches: types.map(t => ({ matchType: t })) };
    }

    // ── MAKE ALL [element] [property] ─────────────────────────────────────────
    if (d.match(/\b(all|every|each)\b/)) {
        // "make all buttons red"
        const col = getColor(d);
        const anim = getAnim(d);
        const types = getTargets(d);
        const updates = [];
        if (col) {
            (types.length ? types : ['button', 'text', 'badge']).forEach(t =>
                updates.push(t === 'button'
                    ? { matchType: t, props: { hoverGlow: col, gradient: `linear-gradient(135deg,${col},${col}88)` } }
                    : { matchType: t, props: { color: col } }));
        }
        if (anim) {
            (types.length ? types : ['text', 'button']).forEach(t => updates.push({ matchType: t, props: { animation: anim } }));
        }
        if (updates.length) return { intent: 'update_elements', reply: `Applied to all!`, updates };
    }

    return null; // Not matched
}

// ── Compound command splitter ────────────────────────────────────────────────
function splitCompound(description) {
    // Split on "and", "also", "then", "; " — but not inside quoted strings
    return description
        .split(/\s+and\s+also\s+|\s+but\s+also\s+|\s+also\s+|\s+then\s+|\s+and\s+|\s*;\s*/)
        .map(s => s.trim())
        .filter(s => s.length > 2);
}

// ── Main export: analyze + handle compound ────────────────────────────────────
export function analyzeLocal(description, currentElements = []) {
    const parts = splitCompound(description);
    if (parts.length <= 1) return analyzeSingle(description.toLowerCase(), currentElements);

    // Multiple commands: merge all results
    const results = parts.map(p => analyzeSingle(p.toLowerCase(), currentElements)).filter(Boolean);
    if (!results.length) return null;
    if (results.length === 1) return results[0];

    // Merge into a 'mixed' action
    const merged = { intent: 'mixed', reply: '' };
    const allUpdates = [], allNew = [], allRemove = [];
    const replies_ = [];
    for (const r of results) {
        if (r.background) merged.background = r.background;
        if (r.updates?.length) allUpdates.push(...r.updates);
        if (r.newElements?.length) allNew.push(...r.newElements);
        if (r.removeMatches?.length) allRemove.push(...r.removeMatches);
        if (r.reply) replies_.push(r.reply);
    }
    if (allUpdates.length) merged.updates = allUpdates;
    if (allNew.length) merged.newElements = allNew;
    if (allRemove.length) merged.removeMatches = allRemove;
    merged.reply = '✅ ' + replies_.join(' + ');
    return merged;
}

// ── Full page generator ───────────────────────────────────────────────────────
export function generateFullPage(description) {
    const d = description.toLowerCase();
    const useCyan = d.includes('blue') || d.includes('cyan');
    const usePurple = d.includes('purple') || d.includes('leaderboard');
    const useRed = d.includes('red') || d.includes('error') || d.includes('404');
    const accent = useRed ? '#ff3864' : useCyan ? '#00e5ff' : usePurple ? '#9d4edd' : '#00ff88';
    const bgGrad = useRed ? 'linear-gradient(135deg,#1a0005,#050508)'
        : useCyan ? 'linear-gradient(135deg,#001520,#050508)'
            : usePurple ? 'linear-gradient(135deg,#0a0010,#050508)' : '#050508';
    const bgType = (useRed || useCyan || usePurple) ? 'gradient' : 'solid';
    const ra = useRed ? 'rgba(255,56,100,' : useCyan ? 'rgba(0,229,255,' : usePurple ? 'rgba(157,78,221,' : 'rgba(0,255,136,';
    const nm = d.match(/(?:called|named|for|titled?)[:\s]+["']?([a-z0-9\s/_-]+?)["']?(?:\s|$)/i);
    const ctf = nm ? nm[1].trim().toUpperCase() : 'HACK//ARENA';
    const base = { background: { type: bgType, value: bgGrad } };
    const card = (l, t, w, h) => ({
        id: uuidv4(), type: 'card', label: 'Card',
        style: {
            left: l === 'center' ? '50%' : l, top: t === 'center' ? '50%' : `${t}px`, width: w, minHeight: h,
            transform: l === 'center' && t === 'center' ? 'translate(-50%,-50%)' : 'translateX(-50%)', zIndex: 1
        },
        props: { background: 'rgba(10,10,20,0.88)', borderColor: `${ra}0.22)`, borderRadius: '16px', blur: true, padding: '48px 40px', shadow: `0 8px 48px ${ra}0.08)` }
    });

    if (d.includes('login') || d.includes('sign in')) return {
        ...base, pageName: 'Login', newElements: [
            card('center', 'center', '420px', '520px'),
            mkEl('text', 'Logo', 'center', 90, '340px', { content: `⚡ ${ctf}`, fontFamily: 'Orbitron', fontSize: '26px', fontWeight: '900', color: accent, animation: 'glowPulse', letterSpacing: '3px', textAlign: 'center' }),
            mkEl('text', 'Sub', 'center', 148, '340px', { content: 'ACCESS TERMINAL', fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#4a5568', letterSpacing: '6px', textAlign: 'center' }),
            mkEl('input', 'User', 'center', 210, '340px', { inputType: 'text', label: 'Username', placeholder: 'Enter username', icon: 'user', borderColor: `${ra}0.3)`, focusColor: accent }),
            mkEl('input', 'Pass', 'center', 300, '340px', { inputType: 'password', label: 'Password', placeholder: 'Enter password', icon: 'lock', borderColor: `${ra}0.3)`, focusColor: accent }),
            mkEl('button', 'Login', 'center', 400, '340px', { text: 'INITIATE ACCESS', gradient: `linear-gradient(135deg,${accent},#00b8cc)`, color: '#050508', fontFamily: 'Orbitron', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', borderRadius: '8px', padding: '14px 24px', hoverGlow: accent }),
            mkEl('text', 'Links', 'center', 456, '340px', { content: 'New here? Register  ·  Forgot password?', fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#4a5568', textAlign: 'center' }),
        ]
    };

    if (d.includes('register') || d.includes('sign up')) return {
        ...base, pageName: 'Register', newElements: [
            card('center', 'center', '440px', '680px'),
            mkEl('text', 'Title', 'center', 80, '360px', { content: 'ENLIST NOW', fontFamily: 'Orbitron', fontSize: '28px', fontWeight: '900', color: accent, animation: 'fadeIn', letterSpacing: '4px', textAlign: 'center' }),
            mkEl('input', 'User', 'center', 155, '360px', { inputType: 'text', label: 'Username', placeholder: 'Choose a callsign', icon: 'user', borderColor: `${ra}0.3)`, focusColor: accent }),
            mkEl('input', 'Email', 'center', 240, '360px', { inputType: 'email', label: 'Email', placeholder: 'operative@domain.com', icon: 'mail', borderColor: `${ra}0.3)`, focusColor: accent }),
            mkEl('input', 'Pass', 'center', 325, '360px', { inputType: 'password', label: 'Password', placeholder: 'Min 8 chars', icon: 'lock', borderColor: `${ra}0.3)`, focusColor: accent }),
            mkEl('input', 'Confirm', 'center', 410, '360px', { inputType: 'password', label: 'Confirm Password', placeholder: 'Repeat password', icon: 'shield', borderColor: `${ra}0.3)`, focusColor: accent }),
            mkEl('button', 'Reg', 'center', 510, '360px', { text: 'CREATE OPERATIVE', gradient: `linear-gradient(135deg,${accent},#9d4edd)`, color: '#fff', fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', borderRadius: '8px', padding: '14px 24px', hoverGlow: accent }),
        ]
    };

    if (d.includes('404') || d.includes('error')) return {
        ...base, pageName: '404 Error', newElements: [
            mkEl('text', '404', 'center', 200, '600px', { content: '404', fontFamily: 'Orbitron', fontSize: '120px', fontWeight: '900', color: '#ff3864', animation: 'glitch', letterSpacing: '10px', textAlign: 'center' }),
            mkEl('text', 'Err', 'center', 330, '600px', { content: 'SIGNAL LOST', fontFamily: 'Orbitron', fontSize: '28px', fontWeight: '700', color: '#ff6b6b', animation: 'flicker', letterSpacing: '8px', textAlign: 'center' }),
            mkEl('text', 'Desc', 'center', 390, '500px', { content: 'This page has been encrypted, deleted, or never existed in our system.', fontFamily: 'Rajdhani', fontSize: '15px', color: '#4a5568', lineHeight: '1.7', textAlign: 'center' }),
            mkEl('button', 'Home', 'center', 455, '200px', { text: '← RETURN HOME', gradient: 'linear-gradient(135deg,#ff3864,#9d4edd)', color: '#fff', fontFamily: 'Orbitron', fontSize: '12px', fontWeight: '700', borderRadius: '8px', padding: '14px 24px', hoverGlow: '#ff3864' }),
        ]
    };

    if (d.includes('leaderboard') || d.includes('scoreboard')) return {
        ...base, pageName: 'Leaderboard', newElements: [
            { id: uuidv4(), type: 'navbar', label: 'Nav', style: { left: '0', top: '0px', width: '100%', zIndex: 10 }, props: { brand: ctf, color: accent } },
            mkEl('text', 'Title', 'center', 100, '600px', { content: '🏆 LEADERBOARD', fontFamily: 'Orbitron', fontSize: '36px', fontWeight: '900', color: accent, animation: 'glowPulse', letterSpacing: '6px', textAlign: 'center' }),
            mkEl('badge', 'Badge', 'center', 168, '200px', { text: '◈ SEASON 01 — LIVE', color: accent, letterSpacing: '3px' }),
            mkEl('text', '1st', 'center', 230, '660px', { content: '🥇 #1 — SHADOWHAWK — 4,200 pts', fontFamily: 'JetBrains Mono', fontSize: '14px', color: '#c8d6e5', textAlign: 'center' }),
            mkEl('text', '2nd', 'center', 294, '660px', { content: '🥈 #2 — CYPH3R — 3,950 pts', fontFamily: 'JetBrains Mono', fontSize: '14px', color: '#c8d6e5', textAlign: 'center' }),
            mkEl('text', '3rd', 'center', 358, '660px', { content: '🥉 #3 — N0ISY — 3,700 pts', fontFamily: 'JetBrains Mono', fontSize: '14px', color: '#c8d6e5', textAlign: 'center' }),
        ]
    };

    if (d.includes('profile') || d.includes('account')) return {
        ...base, pageName: 'Profile', newElements: [
            { id: uuidv4(), type: 'navbar', label: 'Nav', style: { left: '0', top: '0px', width: '100%', zIndex: 10 }, props: { brand: ctf, color: accent } },
            card('center', 120, '480px', '340px'),
            mkEl('text', 'Name', 'center', 160, '460px', { content: 'SHADOWHAWK', fontFamily: 'Orbitron', fontSize: '22px', fontWeight: '900', color: accent, animation: 'glowPulse', textAlign: 'center' }),
            mkEl('badge', 'Rank', 'center', 212, '200px', { text: '◈ RANK #1  —  ELITE', color: accent, letterSpacing: '2px' }),
            mkEl('text', 'Score', 'center', 250, '460px', { content: '4,200 PTS  ·  23 SOLVES  ·  7 FLAGS', fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#4a5568', textAlign: 'center' }),
            mkEl('button', 'Edit', 'center', 310, '200px', { text: 'EDIT PROFILE', gradient: `linear-gradient(135deg,${accent},${accent}88)`, color: '#050508', fontFamily: 'Orbitron', fontSize: '11px', borderRadius: '8px', padding: '10px 20px', hoverGlow: accent }),
        ]
    };

    if (d.includes('challenge')) return {
        ...base, pageName: 'Challenges', newElements: [
            { id: uuidv4(), type: 'navbar', label: 'Nav', style: { left: '0', top: '0px', width: '100%', zIndex: 10 }, props: { brand: ctf, color: accent } },
            mkEl('text', 'Title', 'center', 100, '600px', { content: 'MISSION BOARD', fontFamily: 'Orbitron', fontSize: '30px', fontWeight: '900', color: accent, animation: 'glowPulse', letterSpacing: '5px', textAlign: 'center' }),
            ...[['WEB EXPLOITS', 120, 200, '#00e5ff'], ['REVERSE ENG', 220, 200, '#9d4edd'], ['CRYPTOGRAPHY', 320, 200, '#00ff88']].map(([name, top, _, col_]) =>
            ({
                id: uuidv4(), type: 'card', label: name, style: { left: '50%', top: `${top + 80}px`, width: '280px', minHeight: '130px', transform: 'translateX(-50%)', zIndex: 1 },
                props: { background: 'rgba(10,10,20,0.85)', borderColor: `${col_}40`, borderRadius: '12px', blur: true, padding: '24px', shadow: `0 4px 24px ${col_}15` }
            })),
        ]
    };

    // Landing (default)
    const hasTimer = d.match(/\b(countdown|timer|event|starts)\b/);
    return {
        ...base, pageName: 'Landing', newElements: [
            { id: uuidv4(), type: 'navbar', label: 'Nav', style: { left: '0', top: '0px', width: '100%', zIndex: 10 }, props: { brand: ctf, color: accent } },
            mkEl('text', 'Hero', 'center', 160, '760px', { content: 'CONQUER THE CYBER FRONTIER', fontFamily: 'Orbitron', fontSize: '52px', fontWeight: '900', color: accent, animation: 'glowPulse', letterSpacing: '4px', lineHeight: '1.15', textAlign: 'center' }),
            mkEl('text', 'Sub', 'center', 290, '600px', { content: 'Elite CTF challenges for hackers, researchers & digital warriors. Prove your worth.', fontFamily: 'Rajdhani', fontSize: '18px', color: '#8892a4', lineHeight: '1.7', animation: 'fadeIn', textAlign: 'center' }),
            mkEl('button', 'CTA', 'center', 385, '220px', { text: 'ENTER ARENA', gradient: `linear-gradient(135deg,${accent},#00b8cc)`, color: '#050508', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: '700', letterSpacing: '3px', borderRadius: '8px', padding: '16px 32px', hoverGlow: accent }),
            ...(hasTimer ? [mkEl('countdown', 'Timer', 'center', 480, '600px', { label: 'EVENT STARTS IN', color: accent, targetDate: new Date(Date.now() + 7 * 86400000).toISOString() })] : []),
        ]
    };
}
