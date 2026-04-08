import { app, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { getConfig, setConfig, VALID_LOCAL_CONFIG_KEYS } from "../configs";
import { setAutoStart, isAutoStart } from "../autostart";
import crypto from 'crypto';


function handleGetLocalConfig(_event: IpcMainInvokeEvent, type: string, key: string) {
    const value = getConfig(`${type}.${key}`)

    console.log(`handleGetLocalConfig: type:${type} key:${key} value:${typeof value} ${value}`);
    return value;
}

function onSetLocalConfig(_event: IpcMainEvent, type: string, key: string, value: any) {
    const VALID_TYPES = ['setting', 'local'];
    if (!VALID_TYPES.includes(type)) {
        console.warn(`onSetLocalConfig: Invalid type: ${type}`);
        return;
    }

    console.log(`onSetLocalConfig: type:${type} key:${key} value:${typeof value} ${value}`);
    setConfig(`${type}.${key}`, value);
}

function onExitApp(_event: IpcMainEvent, type: string) {
    console.log(`onExitApp: ${type}`);

    if (type === 'restart') {
        app.relaunch();
    }

    app.isQuitting = true;
    app.quit();
}

function onSetAutoStart(_event: IpcMainEvent, enable: boolean) {
    setAutoStart(enable);
}

function onIsAutoStart(event: IpcMainEvent) {
    event.returnValue = isAutoStart();
}

function onSaveEncryptedConfig(_event: IpcMainEvent, key: string, value: string) {
    const decrypted = decryptConfig(value);
    if (!decrypted) return;

    const parsed = JSON.parse(decrypted);
    // console.log('onSaveEncryptedConfig: Parsed config:', parsed);

    switch (key) {
        case 'setting':
            return saveEncryptedConfigs(parsed);
        case 'autoRunShowType':
            // "front" | "minisize" to front | minisize
            const type = (parsed as string).replaceAll('"', '');
            return saveEncryptedConfigs({ autoRunShowType: type });
    }
}

function saveEncryptedConfigs(items: Record<string, any>) {
    for (const [key, value] of Object.entries(items)) {
        if (!VALID_LOCAL_CONFIG_KEYS.includes(key)) continue;

        console.log(`saveConfig: Updated config local.${key} = ${value}`);
        setConfig(`local.${key}`, value);
    }
}

function decryptConfig(encrypted: string): any {
    const algorithm = 'aes-128-ecb';
    const key = Buffer.from('aaaaaaaaaaaaaaaa', 'utf-8');

    let decrypted;
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, null);
        decipher.setAutoPadding(true);

        decrypted = decipher.update(encrypted, 'base64', 'utf-8');
        decrypted += decipher.final('utf-8');
    } catch (err) {
        console.error('Failed to decrypt config', err);
        return null;
    }

    return decrypted;
}

export function registerAppIPCHandlers() {
    ipcMain.handle('get-local-config', handleGetLocalConfig);
    ipcMain.on('set-local-config', onSetLocalConfig);
    ipcMain.on('exit-app', onExitApp);
    ipcMain.on('set-auto-start', onSetAutoStart);
    ipcMain.on('is-auto-start', onIsAutoStart);
    ipcMain.on('save-encrypted-config', onSaveEncryptedConfig);
}
