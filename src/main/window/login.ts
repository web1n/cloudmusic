import { LOGIN_URL, MUSIC_URL, createWindow, getWindow } from './index';


export function createLoginWindow() {
    const window = createWindow('login', {
        width: 500,
        height: 600,
        modal: true,
        parent: getWindow('main'),
    });
    window.loadURL(LOGIN_URL);

    window.webContents.on('will-navigate', (_event, navUrl) => {
        if (navUrl.startsWith(MUSIC_URL)) {
            getWindow('main')?.webContents.send('login-success');
            window.close();
        }
    });
}
