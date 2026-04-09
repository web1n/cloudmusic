import { webFrame } from 'electron';
import cloudmusic from './cloudmusic.scss?inline';
import login from './login.scss?inline';


const STYLE_TYPES = {
    cloudmusic,
    login,
} as const;

export type StyleType = keyof typeof STYLE_TYPES;

export function insertCss(type: StyleType) {
    window.addEventListener('DOMContentLoaded', () => {
        console.log(`Inserting ${type} CSS into the page`);
        webFrame.insertCSS(STYLE_TYPES[type]);
    });
}
