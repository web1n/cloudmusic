import { contextBridge } from 'electron';
import { initLocalStorageHook, initMediaSessionHook } from './hook';
import { app, mediaControl, windowControl } from './api';


contextBridge.exposeInMainWorld('windowControl', windowControl);
contextBridge.exposeInMainWorld('mediaControl', mediaControl);
contextBridge.exposeInMainWorld('App', app);

contextBridge.executeInMainWorld({ func: initMediaSessionHook });
contextBridge.executeInMainWorld({ func: initLocalStorageHook });
