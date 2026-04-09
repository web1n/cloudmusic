import { contextBridge, webFrame } from 'electron';
import { initLocalStorageHook, initMediaSessionHook } from './hook';
import { app, mediaControl, windowControl } from './api';
import style from './css/login.scss?inline';


contextBridge.exposeInMainWorld('windowControl', windowControl);
contextBridge.exposeInMainWorld('mediaControl', mediaControl);
contextBridge.exposeInMainWorld('App', app);

contextBridge.executeInMainWorld({ func: initMediaSessionHook });
contextBridge.executeInMainWorld({ func: initLocalStorageHook });

window.addEventListener('DOMContentLoaded', () => {
    webFrame.insertCSS(style);
});
