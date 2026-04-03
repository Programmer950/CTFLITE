import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Eye, EyeOff, Shield, Search } from 'lucide-react';
import './Elements.css';

const ICONS = { user: User, lock: Lock, mail: Mail, shield: Shield, search: Search };

const animationVariants = {
    fadeIn: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
    slideInLeft: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
    slideInRight: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
    none: { initial: {}, animate: {} },
};

/* ────────────────── BUTTON ────────────────── */
export function ButtonElement({ props = {}, isSelected }) {
    const {
        text = 'BUTTON', variant = 'gradient',
        gradient = 'linear-gradient(135deg,#00ff88,#00b8cc)',
        color = '#050508', fontFamily = 'Orbitron', fontSize = '13px',
        fontWeight = '700', letterSpacing = '2px', borderRadius = '8px',
        padding = '12px 24px', hoverGlow = '#00ff88', animation = 'none',
        borderColor, background,
    } = props;

    const [hovered, setHovered] = useState(false);
    const anim = animationVariants[animation] || animationVariants.none;

    const style = {
        display: 'block', width: '100%', padding,
        background: variant === 'gradient' ? gradient : (variant === 'outline' ? 'transparent' : (background || gradient)),
        border: variant === 'outline' ? `1.5px solid ${borderColor || hoverGlow}` : 'none',
        color, fontFamily, fontSize, fontWeight, letterSpacing,
        borderRadius, cursor: 'pointer',
        boxShadow: hovered ? `0 0 24px ${hoverGlow}55, 0 4px 16px ${hoverGlow}22` : '0 4px 12px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-1px) scale(1.01)' : 'none',
        transition: 'all 0.25s ease',
        textTransform: 'uppercase',
    };

    return (
        <motion.button
            style={style}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            {...(anim.initial ? { initial: anim.initial, animate: anim.animate, transition: { duration: 0.5 } } : {})}
        >
            {text}
        </motion.button>
    );
}

/* ────────────────── INPUT ────────────────── */
export function InputElement({ props = {} }) {
    const {
        inputType = 'text', label = 'Label', placeholder = 'Enter value...',
        icon = 'user', borderColor = 'rgba(0,255,136,0.3)', focusColor = '#00ff88',
    } = props;

    const [focused, setFocused] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const IconComp = ICONS[icon] || User;

    return (
        <div className="el-input-wrap">
            <label className="el-label" style={{ color: focused ? focusColor : '#8892a4' }}>
                {label}
            </label>
            <div className="el-input-field" style={{
                borderColor: focused ? focusColor : borderColor,
                boxShadow: focused ? `0 0 12px ${focusColor}30` : 'none',
            }}>
                <IconComp size={14} style={{ color: focused ? focusColor : '#4a5568', flexShrink: 0 }} />
                <input
                    type={inputType === 'password' && !showPw ? 'password' : inputType === 'password' ? 'text' : inputType}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{ color: '#e2e8f4' }}
                />
                {inputType === 'password' && (
                    <button onClick={() => setShowPw(!showPw)} style={{ color: '#4a5568', padding: 0, lineHeight: 1 }}>
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ────────────────── TEXT ────────────────── */
export function TextElement({ props = {} }) {
    const {
        content = 'Text element', fontFamily = 'Rajdhani', fontSize = '16px',
        fontWeight = '400', color = '#e2e8f4', letterSpacing, lineHeight,
        textAlign, animation = 'none',
    } = props;

    const style = { fontFamily, fontSize, fontWeight, color, letterSpacing, lineHeight, textAlign };
    const anim = animationVariants[animation] || animationVariants.none;

    if (animation === 'glitch') {
        return <div className="el-text glitch-text" style={style}>{content}</div>;
    }
    if (animation === 'glowPulse') {
        return <div className="el-text animate-glow" style={style}>{content}</div>;
    }
    if (animation === 'flicker') {
        return <div className="el-text animate-flicker" style={style}>{content}</div>;
    }

    return (
        <motion.div
            className="el-text"
            style={style}
            {...(anim.initial ? { initial: anim.initial, animate: anim.animate, transition: { duration: 0.5 } } : {})}
        >
            {content}
        </motion.div>
    );
}

/* ────────────────── CARD ────────────────── */
export function CardElement({ props = {}, children }) {
    const {
        background = 'rgba(10,10,20,0.8)',
        borderColor = 'rgba(0,255,136,0.2)',
        borderRadius = '12px',
        blur = true,
        padding = '32px',
        shadow = '0 8px 32px rgba(0,255,136,0.06)',
    } = props;

    return (
        <div style={{
            position: 'absolute', inset: 0,
            background,
            border: `1px solid ${borderColor}`,
            borderRadius,
            backdropFilter: blur ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: blur ? 'blur(16px)' : 'none',
            boxShadow: shadow,
            padding,
        }}>
            {children}
        </div>
    );
}

/* ────────────────── COUNTDOWN ────────────────── */
export function CountdownElement({ props = {} }) {
    const { targetDate, label = 'EVENT STARTS IN', color = '#00e5ff' } = props;
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const calc = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
            setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    const pad = n => String(n ?? 0).padStart(2, '0');

    return (
        <div className="el-countdown">
            <div className="el-countdown-label" style={{ color: '#4a5568' }}>{label}</div>
            <div className="el-countdown-grid">
                {[['d', 'DAYS'], ['h', 'HRS'], ['m', 'MIN'], ['s', 'SEC']].map(([k, lbl]) => (
                    <div key={k} className="el-countdown-unit">
                        <span className="el-countdown-num" style={{ color, textShadow: `0 0 20px ${color}55` }}>
                            {pad(timeLeft[k])}
                        </span>
                        <span className="el-countdown-sublabel">{lbl}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ────────────────── BADGE ────────────────── */
export function BadgeElement({ props = {} }) {
    const {
        text = 'BADGE', color = '#00ff88',
        background = 'rgba(0,255,136,0.1)',
        borderColor = 'rgba(0,255,136,0.4)',
        fontFamily = 'JetBrains Mono', fontSize = '11px', letterSpacing = '2px',
    } = props;

    return (
        <span style={{
            display: 'inline-block', background, border: `1px solid ${borderColor}`,
            color, fontFamily, fontSize, letterSpacing, fontWeight: '600',
            padding: '4px 12px', borderRadius: '4px', textTransform: 'uppercase',
        }}>
            {text}
        </span>
    );
}

/* ────────────────── IMAGE ────────────────── */
export function ImageElement({ props = {} }) {
    const { src, alt = 'Image', objectFit = 'cover', borderRadius = '8px' } = props;
    return src ? (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit, borderRadius, display: 'block' }} />
    ) : (
        <div style={{
            width: '100%', height: '100%', minHeight: '120px', borderRadius,
            background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#4a5568', fontFamily: 'JetBrains Mono', fontSize: '12px',
        }}>
            [ IMAGE ]
        </div>
    );
}

/* ────────────────── SPACER ────────────────── */
export function SpacerElement({ props = {} }) {
    const { height = '40px' } = props;
    return <div style={{ width: '100%', height }} />;
}

/* ────────────────── DIVIDER ────────────────── */
export function DividerElement({ props = {} }) {
    const { color = 'rgba(0,255,136,0.2)', thickness = '1px', style: borderStyle = 'solid' } = props;
    return <hr style={{ border: 'none', borderTop: `${thickness} ${borderStyle} ${color}`, width: '100%', margin: '8px 0' }} />;
}

/* ────────────────── NAVBAR ────────────────── */
export function NavBarElement({ props = {} }) {
    const { brand = 'HACK//ARENA', color = '#00ff88' } = props;
    return (
        <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px', height: '60px',
            background: 'rgba(5,5,8,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
        }}>
            <span style={{
                fontFamily: 'Orbitron', fontSize: '18px', fontWeight: '900',
                color, letterSpacing: '3px', textShadow: `0 0 16px ${color}66`,
            }}>
                {brand}
            </span>
            <div style={{ display: 'flex', gap: '24px' }}>
                {['Challenges', 'Scoreboard', 'Teams', 'Profile'].map(item => (
                    <span key={item} style={{
                        fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: '600',
                        color: '#8892a4', letterSpacing: '1px', cursor: 'pointer',
                        textTransform: 'uppercase',
                    }}>
                        {item}
                    </span>
                ))}
            </div>
            <div style={{
                background: 'linear-gradient(135deg,#00ff88,#00b8cc)', color: '#050508',
                fontFamily: 'Orbitron', fontSize: '11px', fontWeight: '700', letterSpacing: '2px',
                padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
            }}>
                LOGIN
            </div>
        </nav>
    );
}
