import { ipcMain } from 'electron';
import { findWindow } from './window';
import { initMediaControl, setControlAvailable, setMediaMetadata, setPlaying } from './media';


export function registerIPCHandlers() {
    ipcMain.on('window-close', (event) => {
        findWindow(event.sender)?.close();
    });
    ipcMain.on('window-minimize', (event) => {
        findWindow(event.sender)?.minimize();
    });
    ipcMain.on('window-maximize', (event) => {
        const window = findWindow(event.sender);
        if (!window) return;

        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    });

    ipcMain.on('init-media-control', () => initMediaControl());
    ipcMain.on('media-control-available', (_, action, available) => setControlAvailable(action, available));
    ipcMain.on('set-current-metadata', (_, metadata) => setMediaMetadata(metadata));
    ipcMain.on('set-play-status', (_, playing: boolean) => setPlaying(playing));
}
