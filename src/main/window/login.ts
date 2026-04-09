import { BrowserWindow, Rectangle, WebContentsView } from 'electron';
import { createWindow, getWindow, loadLocalFile, sendIpc } from './index';
import { getConfig } from '../configs';
import { join } from 'path';


const LOGIN_URL = 'https://music.163.com/#/login';

export function setLoginViewBounds(window: BrowserWindow, bounds: Rectangle) {
    const loginView = window.contentView.children.at(0);
    if (!loginView) return;

    loginView.setVisible(true);
    loginView.setBounds(bounds);
}

function createLoginView(window: BrowserWindow) {
    const loginView = new WebContentsView({
        webPreferences: {
            preload: join(__dirname, 'preload-login.js'),
            contextIsolation: true,
            nodeIntegrationInSubFrames: true,
        },
    });
    loginView.setVisible(false);
    loginView.setBounds({ x: 0, y: 0, width: 1, height: 1 });

    loginView.webContents.loadURL(LOGIN_URL);

    loginView.webContents.once('will-navigate', (event, url) => {
        console.log(`Login view navigating to ${url}`);

        event.preventDefault();
        sendIpc('main', 'login-success');
        window.close();
    });

    window.contentView.addChildView(loginView);

    if (process.env.NODE_ENV === 'development') {
        loginView.webContents.openDevTools({ mode: 'detach' });
    }
}

export function createLoginWindow() {
    const window = createWindow('login', {
        width: 300,
        height: 300,
        resizable: false,
        modal: true,
        parent: getWindow('main'),
        frame: false,
    });

    loadLocalFile(window, 'login.html');

    if (getConfig('local.useIFrameLogin', true)) {
        createLoginView(window);
    }

    if (process.env.NODE_ENV === 'development') {
        window.webContents.openDevTools({ mode: 'detach' });
    }
}
