import { ipcRenderer } from 'electron';
import { App } from '../../cloudmusic';
import { getAvaliableFontFamilies } from '../utils/fonts';


export function getLocalConfig(item: { type: string, key: string }): Promise<any> {
    return ipcRenderer.invoke('get-local-config', item.type, item.key);
}

export function setLocalConfig(item: { type: string, key: string, value: any }): void {
    ipcRenderer.send('set-local-config', item.type, item.key, item.value);
}

export function exitApp(type: string): void {
    ipcRenderer.send('exit-app', type);
}

export function setAutoStart(enable: boolean): void {
    ipcRenderer.send('set-auto-start', enable);
}

export function isAutoStart(): boolean {
    return ipcRenderer.sendSync('is-auto-start');
}

export function saveEncryptedConfig(key: string, value: string): void {
    ipcRenderer.send('save-encrypted-config', key, value);
}

const App: App = {
    getLocalConfig,
    setLocalConfig,
    exitApp,
    setAutoStart,
    isAutoStart,
    saveEncryptedConfig,
    localFonts: getAvaliableFontFamilies(),
}

export default App;
