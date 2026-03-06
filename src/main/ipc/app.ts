import { app, ipcMain, IpcMainEvent } from "electron";


function onExitApp(_event: IpcMainEvent, type: string) {
    console.log(`onExitApp: ${type}`);

    app.isQuitting = true;
    app.quit();
}

export function registerAppIPCHandlers() {
    ipcMain.on('exit-app', onExitApp);
}
