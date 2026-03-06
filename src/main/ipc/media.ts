import { ipcMain } from "electron";
import { initMediaControl, setControlAvailable, setMediaMetadata, setPlaying } from "../media";


export function registerMediaControlIPCHandlers() {
    ipcMain.on('init-media-control', () => initMediaControl());
    ipcMain.on('media-control-available', (_, action, available) => setControlAvailable(action, available));
    ipcMain.on('set-current-metadata', (_, metadata) => setMediaMetadata(metadata));
    ipcMain.on('set-play-status', (_, playing: boolean) => setPlaying(playing));
}
