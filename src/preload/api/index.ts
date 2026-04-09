import { contextBridge } from 'electron';
import App from './app';
import Login from './login';
import mediaControl from './media';
import windowControl from './window';


const API_TYPES = {
    App,
    Login,
    mediaControl,
    windowControl,
} as const;

export type ApiType = keyof typeof API_TYPES;

export function exposeApi(...types: ApiType[]) {
    for (const type of types) {
        console.log(`Exposing ${type} API to the main world`);
        contextBridge.exposeInMainWorld(type, API_TYPES[type]);
    }
};
