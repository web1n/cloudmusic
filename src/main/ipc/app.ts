import { app, ipcMain, IpcMainEvent } from "electron";
import { getConfig, setConfig } from "../configs";


function handleGetLocalConfig(_event: IpcMainEvent, type: string, key: string) {
    const value = getConfig(`${type}.${key}`)

    console.log(`handleGetLocalConfig: type:${type} key:${key} value:${typeof value} ${value}`);
    return value;
}

function onSetLocalConfig(_event: IpcMainEvent, type: string, key: string, value: string) {
    const VALID_TYPES = ['setting'];
    if (!VALID_TYPES.includes(type)) {
        console.warn(`onSetLocalConfig: Invalid type: ${type}`);
        return;
    }

    console.log(`onSetLocalConfig: type:${type} key:${key} value:${typeof value} ${value}`);
    setConfig(`${type}.${key}`, value);
}

function onExitApp(_event: IpcMainEvent, type: string) {
    console.log(`onExitApp: ${type}`);

    app.isQuitting = true;
    app.quit();
}

export function registerAppIPCHandlers() {
    ipcMain.handle('get-local-config', handleGetLocalConfig);
    ipcMain.on('set-local-config', onSetLocalConfig);
    ipcMain.on('exit-app', onExitApp);
}
