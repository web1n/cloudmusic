import { BrowserWindow, BrowserWindowConstructorOptions, nativeImage, WebContents } from 'electron';
import { join } from 'path';
import { createMainWindow } from './main';
import { createLoginWindow } from './login';
import appIcon from '../../../resources/icon.png';


export const MUSIC_URL = 'https://music.163.com/st/webplayer';
export const LOGIN_URL = 'https://music.163.com/login?targetUrl=https%3A%2F%2Fmusic.163.com%2Fst%2Fwebplayer';

export type WindowType = 'main' | 'login';

const windows: { [key in WindowType]?: BrowserWindow } = {};

export function createWindow(type: WindowType, options?: BrowserWindowConstructorOptions): BrowserWindow {
    if (windows[type]) return windows[type]!;

    const window = new BrowserWindow({
        icon: nativeImage.createFromDataURL(appIcon),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            ...(type === 'main' ? { preload: join(__dirname, './preload.js') } : {}),
        },
        ...(options || {})
    });
    windows[type] = window;

    window.setMenu(null);
    window.webContents.on('console-message', (event) => {
        console.log(`[Renderer ${type} ${event.level}] ${event.message}`);
    });
    window.on('closed', () => {
        if (windows[type] === window) windows[type] = undefined;
    });

    return window;
}

export function findWindow(webContents: WebContents) {
    return Object.values(windows).find(win => {
        return win?.webContents === webContents;
    });
}

export function getWindow(type: WindowType) {
    return windows[type];
}

export function showWindow(type: WindowType) {
    const targetWindow = getWindow(type);
    if (!targetWindow) return;

    targetWindow.show();
    targetWindow.focus();
}

export function createShowWindow(type: WindowType) {
    const targetWindow = getWindow(type);

    if (targetWindow) {
        showWindow(type);
    } else {
        switch (type) {
            case 'login':
                return createLoginWindow();
            case 'main':
                return createMainWindow();
        }
    }
}

export function sendIpc(type: WindowType, channel: string, ...args: any[]) {
    getWindow(type).webContents.send(channel, ...args);
}
