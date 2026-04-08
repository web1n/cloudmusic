import { ipcRenderer } from 'electron';
import { App, Login, MediaControl, WindowControl } from '../cloudmusic';
import { getAvaliableFontFamilies } from './fonts';


export const windowControl: WindowControl = {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    saveResources: process.env.NODE_ENV === 'development' && !!process.env['SAVE_RESOURCES'],
    onLoginSuccess: (callback) => {
        ipcRenderer.on('login-success', () => callback());
    },
};

export const mediaControl: MediaControl = {
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

export const app: App = {
    getLocalConfig: ({ type, key }) => ipcRenderer.invoke('get-local-config', type, key),
    setLocalConfig: ({ type, key, value }) => ipcRenderer.send('set-local-config', type, key, value),
    exitApp: (type: string) => ipcRenderer.send('exit-app', type),
    setAutoStart: (enable) => ipcRenderer.send('set-auto-start', enable),
    isAutoStart: () => ipcRenderer.sendSync('is-auto-start'),
    saveEncryptedConfig: (key, value) => ipcRenderer.send('save-encrypted-config', key, value),
    localFonts: getAvaliableFontFamilies(),
}

export const login: Login = {
    generateUnikey: () => ipcRenderer.invoke('generate-unikey'),
    checkLoginStatus: (unikey: string) => ipcRenderer.invoke('check-login-status', unikey),
    getUserProfile: () => ipcRenderer.invoke('get-user-profile'),
}
