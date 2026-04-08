import { contextBridge } from 'electron';
import { app, login, windowControl } from './api';


contextBridge.exposeInMainWorld('windowControl', windowControl);
contextBridge.exposeInMainWorld('Login', login);
contextBridge.exposeInMainWorld('App', app);
