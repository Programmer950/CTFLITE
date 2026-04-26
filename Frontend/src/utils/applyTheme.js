function toKebab(str) {
    return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
}

export function applyTheme(theme) {
    const root = document.documentElement;
    if (!theme) return;

    // COLORS (no prefix)
    if (theme.colors) {
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${toKebab(key)}`, value);
        });
    }

    // OPACITY
    if (theme.opacity) {
        Object.entries(theme.opacity).forEach(([key, value]) => {
            root.style.setProperty(`--opacity-${toKebab(key)}`, value);
        });
    }

    // GRADIENTS
    if (theme.gradients) {
        Object.entries(theme.gradients).forEach(([key, value]) => {
            root.style.setProperty(`--gradient-${toKebab(key)}`, value);
        });
    }

    // EFFECTS
    if (theme.effects) {
        Object.entries(theme.effects).forEach(([key, value]) => {
            root.style.setProperty(`--effect-${toKebab(key)}`, value);
        });
    }

    // RADIUS
    if (theme.radius) {
        Object.entries(theme.radius).forEach(([key, value]) => {
            root.style.setProperty(`--radius-${toKebab(key)}`, value);
        });
    }
}