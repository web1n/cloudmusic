import fs from 'fs';
import path from 'path';


const WEB_FEATURES = [
    {
        pattern: /[a-zA-Z]\.isWeb/g,
        replacement: 'false',
        keywords: [
            '开启GPU加速',
            '程序启动时自动播放',
        ],
    },
];

const REGEX_PATCHES = [
    { pattern: /[a-zA-Z]\.App\.getLocalConfig/g, replacement: 'window.App.getLocalConfig' },
    { pattern: /[a-zA-Z]\.App\.setLocalConfig/g, replacement: 'window.App.setLocalConfig' },
    { pattern: /[a-zA-Z]\.App\.exitApp/g, replacement: 'window.App.exitApp' },
];

function utf8ToUnicode(str: string): string {
    return Array.from(str).map(c => {
        const code = c.charCodeAt(0);
        return code > 0x7f ? `\\u${code.toString(16).padStart(4, '0')}` : c;
    }).join('');
}

function searchJsFile(root: string, search: string): string | null {
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        const full = path.join(root, entry.name);
        if (entry.isDirectory()) {
            const found = searchJsFile(full, search);
            if (found) return found;
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            try {
                if (fs.readFileSync(full, 'utf-8').includes(search)) return full;
            } catch { /* ignore */ }
        }
    }
    return null;
}

function decodeUnicode(file: string) {
    const content = fs.readFileSync(file, 'utf-8');
    const decoded = content.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });

    fs.writeFileSync(file, decoded, 'utf-8');
}

function patchFeature(file: string, pattern: RegExp, replacement: string, keyword: string): boolean {
    const content = fs.readFileSync(file, 'utf-8');

    const idx = content.indexOf(keyword);
    if (idx === -1) return false;

    const before = content.slice(0, idx);
    let nearestMatch: RegExpExecArray | null = null;
    let match: RegExpExecArray | null;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(before)) !== null) {
        nearestMatch = match;
    }
    if (!nearestMatch) return false;

    const tokenStart = nearestMatch.index;
    const tokenEnd = tokenStart + nearestMatch[0].length;
    const patched =
        content.slice(0, tokenStart) +
        replacement +
        content.slice(tokenEnd);

    fs.writeFileSync(file, patched, 'utf-8');
    return true;
}

function patchAllFeatures(file: string) {
    for (const { pattern, replacement, keywords } of WEB_FEATURES) {
        for (const keyword of keywords) {
            if (!patchFeature(file, pattern, replacement, keyword)) {
                throw new Error(`Patch failed: ${keyword}`);
            }
        }
    }
}

function patchAllRegex(file: string) {
    let content = fs.readFileSync(file, 'utf-8');

    for (const { pattern, replacement } of REGEX_PATCHES) {
        const replaced = content.replaceAll(pattern, replacement);
        if (replaced === content) {
            throw new Error(`Replace failed: ${pattern}`);
        }

        content = replaced;
    }

    fs.writeFileSync(file, content, 'utf-8');
}

function main() {
    const root = path.join(path.dirname(path.dirname(__filename)), 'local-resources');
    const settingsJs = searchJsFile(root, utf8ToUnicode('关于网易云音乐'));
    if (!settingsJs) {
        throw new Error('settings.js not found');
    }

    decodeUnicode(settingsJs);
    patchAllFeatures(settingsJs);
    patchAllRegex(settingsJs);

    console.log('All done!');
}

main();
