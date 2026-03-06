import { contextBridge, ipcRenderer } from 'electron';
import { initMediaSessionHook } from './media';
import { initLocalStorageHook } from './storage';
import type { MediaControl, WindowControl } from '../cloudmusic';


const windowControl: WindowControl = {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    platform: process.platform,
    onLoginSuccess: (callback) => {
        ipcRenderer.on('login-success', () => callback());
    },
};

const mediaControl: MediaControl = {
    initMediaControl: () => {
        ipcRenderer.send('init-media-control');
    },
    setMediaControlAvailable: (action: MediaSessionAction, available: boolean) => {
        ipcRenderer.send('media-control-available', action, available);
    },
    setCurrentMetadata: (metadata: MediaMetadata | null) => {
        ipcRenderer.send('set-current-metadata', metadata);
    },
    setPlayStatus: (playing: boolean) => {
        ipcRenderer.send('set-play-status', playing);
    },
    onPlay: (callback) => {
        ipcRenderer.on('media-control', (_, action) => callback(action));
    },
};

contextBridge.exposeInMainWorld('windowControl', windowControl);
contextBridge.exposeInMainWorld('mediaControl', mediaControl);

contextBridge.executeInMainWorld({ func: initMediaSessionHook });
contextBridge.executeInMainWorld({ func: initLocalStorageHook });
