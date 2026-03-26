// Component Registry — defines all drag-and-droppable component types
import {
    Type, Square, MousePointerClick, TextCursor, Image,
    Minus, Timer, Tag, Navigation, AlignLeft, Shield
} from 'lucide-react';

export const COMPONENT_CATEGORIES = [
    {
        name: 'FORM',
        components: [
            {
                type: 'input',
                label: 'Input Field',
                icon: 'TextCursor',
                defaultProps: {
                    inputType: 'text',
                    label: 'Field Label',
                    placeholder: 'Placeholder...',
                    icon: 'user',
                    borderColor: 'rgba(0,255,136,0.3)',
                    focusColor: '#00ff88',
                },
                defaultStyle: { width: '300px', zIndex: 2 },
            },
            {
                type: 'button',
                label: 'Button',
                icon: 'MousePointerClick',
                defaultProps: {
                    text: 'CLICK ME',
                    variant: 'gradient',
                    gradient: 'linear-gradient(135deg, #00ff88, #00b8cc)',
                    color: '#050508',
                    fontFamily: 'Orbitron',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    hoverGlow: '#00ff88',
                    animation: 'none',
                },
                defaultStyle: { width: '200px', zIndex: 2 },
            },
        ],
    },
    {
        name: 'TYPOGRAPHY',
        components: [
            {
                type: 'text',
                label: 'Heading',
                icon: 'Type',
                defaultProps: {
                    content: 'HEADING',
                    fontFamily: 'Orbitron',
                    fontSize: '32px',
                    fontWeight: '900',
                    color: '#00ff88',
                    letterSpacing: '3px',
                    animation: 'none',
                },
                defaultStyle: { width: '400px', zIndex: 2 },
            },
            {
                type: 'text',
                label: 'Paragraph',
                icon: 'AlignLeft',
                defaultProps: {
                    content: 'Your text goes here. Click to edit.',
                    fontFamily: 'Rajdhani',
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#8892a4',
                    lineHeight: '1.7',
                    animation: 'none',
                },
                defaultStyle: { width: '400px', zIndex: 2 },
            },
            {
                type: 'text',
                label: 'Glitch Text',
                icon: 'Shield',
                defaultProps: {
                    content: 'GLITCH',
                    fontFamily: 'Orbitron',
                    fontSize: '40px',
                    fontWeight: '900',
                    color: '#00ff88',
                    animation: 'glitch',
                    letterSpacing: '4px',
                },
                defaultStyle: { width: '300px', zIndex: 2 },
            },
        ],
    },
    {
        name: 'LAYOUT',
        components: [
            {
                type: 'card',
                label: 'Card / Box',
                icon: 'Square',
                defaultProps: {
                    background: 'rgba(10,10,20,0.8)',
                    borderColor: 'rgba(0,255,136,0.2)',
                    borderRadius: '12px',
                    blur: true,
                    padding: '32px',
                    shadow: '0 8px 32px rgba(0,255,136,0.06)',
                },
                defaultStyle: { width: '380px', minHeight: '200px', zIndex: 1 },
            },
            {
                type: 'spacer',
                label: 'Spacer',
                icon: 'Minus',
                defaultProps: { height: '40px' },
                defaultStyle: { width: '100%', zIndex: 1 },
            },
            {
                type: 'divider',
                label: 'Divider',
                icon: 'Minus',
                defaultProps: { color: 'rgba(0,255,136,0.2)', thickness: '1px', style: 'solid' },
                defaultStyle: { width: '300px', zIndex: 1 },
            },
        ],
    },
    {
        name: 'WIDGETS',
        components: [
            {
                type: 'countdown',
                label: 'Countdown',
                icon: 'Timer',
                defaultProps: {
                    targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    label: 'EVENT STARTS IN',
                    color: '#00e5ff',
                },
                defaultStyle: { width: '500px', zIndex: 2 },
            },
            {
                type: 'badge',
                label: 'Badge / Tag',
                icon: 'Tag',
                defaultProps: {
                    text: 'BEGINNER',
                    color: '#00ff88',
                    background: 'rgba(0,255,136,0.1)',
                    borderColor: 'rgba(0,255,136,0.4)',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    letterSpacing: '2px',
                },
                defaultStyle: { width: 'auto', zIndex: 2 },
            },
            {
                type: 'image',
                label: 'Image',
                icon: 'Image',
                defaultProps: {
                    src: '',
                    alt: 'Image',
                    objectFit: 'cover',
                    borderRadius: '8px',
                },
                defaultStyle: { width: '300px', height: '200px', zIndex: 2 },
            },
            {
                type: 'navbar',
                label: 'Nav Bar',
                icon: 'Navigation',
                defaultProps: { brand: 'CTF//ARENA', color: '#00ff88' },
                defaultStyle: { width: '100%', zIndex: 10 },
            },
        ],
    },
];

export const ICON_MAP = {
    Type, Square, MousePointerClick, TextCursor, Image,
    Minus, Timer, Tag, Navigation, AlignLeft, Shield,
};
