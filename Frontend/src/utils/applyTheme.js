export function applyTheme(theme) {
    const root = document.documentElement;

    if (!theme) return;

    if (theme.colors) {
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });
    }

    if (theme.radius) {
        Object.entries(theme.radius).forEach(([key, value]) => {
            root.style.setProperty(`--radius-${key}`, value);
        });
    }
}