import { app, ipcMain, BrowserWindow, IpcMainEvent } from "electron";


function onCloseWindow(event: IpcMainEvent) {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    window.close();
}

function onMinimizeWindow(event: IpcMainEvent) {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    window.minimize();
}

function onMaximizeWindow(event: IpcMainEvent) {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
}

export function registerWindowControlIPCHandlers() {
    ipcMain.on('window-close', onCloseWindow);
    ipcMain.on('window-minimize', onMinimizeWindow);
    ipcMain.on('window-maximize', onMaximizeWindow);
}
