import { createWindow, getWindow, loadLocalFile } from './index';


export function createLoginWindow() {
    const window = createWindow('login', {
        width: 300,
        height: 350,
        resizable: false,
        modal: true,
        parent: getWindow('main'),
        frame: false,
    });

    loadLocalFile(window, 'login.html');
    window.webContents.openDevTools({ mode: 'detach' });
}
