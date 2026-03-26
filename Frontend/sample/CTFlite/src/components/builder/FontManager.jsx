import { useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Type, Trash2, Upload, Link } from 'lucide-react';
import './FontManager.css';

const GOOGLE_FONTS_IMPORT_REGEX = /family=([^&:]+)/g;

export default function FontManager() {
    const { customFonts, addCustomFont, removeCustomFont } = useBuilder();
    const fileInputRef = useRef(null);
    const googleUrlRef = useRef(null);
    const styleTagRef = useRef(null);

    // Ensure a persistent style tag for injected fonts
    const getStyleTag = () => {
        if (styleTagRef.current) return styleTagRef.current;
        let tag = document.getElementById('ctf-custom-fonts');
        if (!tag) {
            tag = document.createElement('style');
            tag.id = 'ctf-custom-fonts';
            document.head.appendChild(tag);
        }
        styleTagRef.current = tag;
        return tag;
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext)) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target.result;
                // Derive font name from filename (remove extension)
                const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

                // Inject @font-face
                const tag = getStyleTag();
                tag.textContent += `\n@font-face { font-family: '${fontName}'; src: url('${dataUrl}'); }`;

                addCustomFont({ name: fontName, url: dataUrl, type: 'file' });
            };
            reader.readAsDataURL(file);
        });
        // Reset input
        e.target.value = '';
    };

    const handleGoogleFont = () => {
        const input = googleUrlRef.current?.value?.trim();
        if (!input) return;

        // Accept either a full @import URL or just font family name
        let fontName = '';
        let importUrl = '';

        if (input.startsWith('http')) {
            // Google Fonts URL like: https://fonts.googleapis.com/css2?family=Roboto
            const match = input.match(/family=([^&:+]+)/);
            fontName = match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : 'Custom Font';
            importUrl = input;
        } else {
            // Treat as font family name, build URL
            fontName = input;
            importUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(input)}&display=swap`;
        }

        // Already added?
        if (customFonts.some(f => f.name === fontName)) return;

        // Inject the import into head
        const tag = getStyleTag();
        tag.textContent = `@import url('${importUrl}');\n` + tag.textContent;

        addCustomFont({ name: fontName, url: importUrl, type: 'google' });
        if (googleUrlRef.current) googleUrlRef.current.value = '';
    };

    const handleRemove = (font) => {
        // Note: we can't easily remove injected CSS, but we can remove from the list
        removeCustomFont(font.name);
    };

    return (
        <div className="font-manager">
            <div className="font-manager-header">
                <Type size={13} />
                <span>Custom Fonts</span>
            </div>

            {/* File upload */}
            <div className="font-upload-zone" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} />
                <span>Upload .ttf / .otf / .woff</span>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Google Fonts */}
            <div className="font-google-row">
                <Link size={12} />
                <input
                    ref={googleUrlRef}
                    className="font-google-input"
                    placeholder="Font name or Google URL"
                    onKeyDown={(e) => e.key === 'Enter' && handleGoogleFont()}
                />
                <button className="font-google-btn" onClick={handleGoogleFont}>+</button>
            </div>

            {/* Font list */}
            {customFonts.length > 0 && (
                <div className="font-list">
                    {customFonts.map(font => (
                        <div key={font.name} className="font-list-item">
                            <span className="font-list-name" style={{ fontFamily: `'${font.name}'` }}>
                                {font.name}
                            </span>
                            <span className="font-list-type">{font.type}</span>
                            <button className="font-list-remove" onClick={() => handleRemove(font)}>
                                <Trash2 size={11} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {customFonts.length === 0 && (
                <p className="font-empty">No custom fonts yet</p>
            )}
        </div>
    );
}
