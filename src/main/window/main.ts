import { app, shell, BrowserWindowConstructorOptions } from 'electron';
import { LOGIN_URL, MUSIC_URL, createWindow, createShowWindow } from './index';
import path from 'path';
import fs from 'fs';
import style from '../../inject/style.css?raw';
import { getConfig } from '../configs';


let isAutoStart = process.argv.includes('--autostart');

function createAutoStartOptions(): BrowserWindowConstructorOptions {
    if (!isAutoStart) return {};
    isAutoStart = false;

    const autoRunShowType = getConfig('local.autoRunShowType', 'front');
    const shouldShowWindow = autoRunShowType === 'front';
    console.log(`App is launched with --autostart, autoRunShowType: ${autoRunShowType}, shouldShowWindow: ${shouldShowWindow}`);

    return { show: shouldShowWindow };
}

export function createMainWindow() {
    const window = createWindow('main', {
        minWidth: 1200,
        minHeight: 800,
        frame: false,
        transparent: true,
        ...createAutoStartOptions(),
    });
    window.loadURL(MUSIC_URL);

    window.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
    window.webContents.on('will-navigate', (event, url) => {
        if (url.startsWith(MUSIC_URL)) {
            return;
        }

        if (url.startsWith(LOGIN_URL.split('?')[0])) {
            event.preventDefault();
            createShowWindow('login');
            return;
        }

        event.preventDefault();
    });

    window.webContents.on('did-finish-load', () => {
        const injectJs = fs.readFileSync(path.join(__dirname, 'inject.js'), 'utf-8');
        window.webContents.executeJavaScript(injectJs);
        window.webContents.insertCSS(style);
    });

    window.on('close', function (event) {
        if (!app.isQuitting) {
            event.preventDefault();
            window.hide();
        }
        return false;
    });

    if (process.env.NODE_ENV === 'development') {
        window.webContents.openDevTools();
    }
}
