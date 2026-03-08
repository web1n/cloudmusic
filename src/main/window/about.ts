import { app, shell } from 'electron';
import { createWindow, getWindow, isLocalUrl, loadLocalFile } from './index';


export function createAboutWindow() {
    const window = createWindow('about', {
        width: 300,
        height: 350,
        resizable: false,
        modal: true,
        parent: getWindow('main'),
        frame: false,
    });
    loadLocalFile(window, 'about.html', { version: app.getVersion() });

    window.webContents.on('will-navigate', (event, url) => {
        if (isLocalUrl(url)) return;

        event.preventDefault();
    });

    if (process.env.NODE_ENV === 'development') {
        window.webContents.openDevTools();
    }
}
