import { BrowserWindow, BrowserWindowConstructorOptions, nativeImage, shell } from 'electron';
import { join } from 'path';
import { createAboutWindow } from './about';
import { createMainWindow } from './main';
import { createLoginWindow } from './login';
import appIcon from '../../../resources/icon.png';


export const MUSIC_URL = 'https://music.163.com/st/webplayer';
export const LOGIN_URL = 'https://music.163.com/login';

export type WindowType = 'main' | 'login' | 'about';

const PRELOAD_JS_PATHS = {
    main: join(__dirname, './preload-cloudmusic.js'),
    login: join(__dirname, './preload-app.js'),
    about: join(__dirname, './preload-app.js'),
};

const windows: { [key in WindowType]?: number } = {};

export function createWindow(type: WindowType, options?: BrowserWindowConstructorOptions): BrowserWindow {
    if (windows[type]) return getWindow(type)!!;

    const window = new BrowserWindow({
        icon: nativeImage.createFromDataURL(appIcon),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: PRELOAD_JS_PATHS[type],
        },
        ...(options || {})
    });
    windows[type] = window.id;

    window.setMenu(null);
    window.on('closed', () => windows[type] = undefined);
    window.webContents.on('did-fail-load', (_event, errorCode, errorDescription, url, isMainFrame) => {
        if (!isMainFrame) return;
        if (errorCode === -3) return; // Ignore ERR_ABORTED, which is usually caused by navigation or window close
        if (isLocalUrl(url)) return;

        console.log(`Failed to load ${url}, errorCode: ${errorCode}, errorDescription: ${errorDescription}, loading 404 page`);
        loadLocalFile(window, '404.html', { errorCode, errorDescription, url });
    });
    window.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    return window;
}

export function loadLocalFile(window: BrowserWindow, fileName: string, query: { [key: string]: any } = {}) {
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        const url = new URL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/${fileName}`);
        url.search = new URLSearchParams(query).toString();

        window.loadURL(url.toString());
    } else {
        window.loadFile(join(__dirname, '../renderer', MAIN_WINDOW_VITE_NAME, fileName), { query });
    }
}

export function getWindow(type: WindowType): BrowserWindow | undefined {
    const windowId = windows[type];
    if (!windowId) return undefined;

    return BrowserWindow.fromId(windowId) || undefined;
}

export function getWindowType(window: BrowserWindow) {
    for (const [type, id] of Object.entries(windows)) {
        if (id === window.id) return type as WindowType;
    }

    return undefined;
}

export function showWindow(type: WindowType) {
    const targetWindow = getWindow(type);
    if (!targetWindow) return;

    targetWindow.show();
    targetWindow.focus();
}

export function getWindowStatus(type: WindowType) {
    const targetWindow = getWindow(type);
    if (!targetWindow) return 'closed';

    if (targetWindow.isMinimized()) return 'minimized';
    if (!targetWindow.isVisible()) return 'hidden';
    return 'visible';
}

export function createShowWindow(type: WindowType) {
    const targetWindow = getWindow(type);

    if (targetWindow) {
        showWindow(type);
    } else {
        switch (type) {
            case 'about':
                return createAboutWindow();
            case 'login':
                return createLoginWindow();
            case 'main':
                return createMainWindow();
        }
    }
}

export function sendIpc(type: WindowType, channel: string, ...args: any[]) {
    const window = getWindow(type);
    if (!window) {
        console.warn(`Failed to send IPC message, window of type ${type} not found`);
        return;
    }

    window.webContents.send(channel, ...args);
}

export function isLocalUrl(url: string | URL) {
    const urlObj = new URL(url);

    return urlObj.protocol === 'file:' || urlObj.hostname === 'localhost';
}
