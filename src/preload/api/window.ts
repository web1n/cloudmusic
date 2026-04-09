import { ipcRenderer } from 'electron';
import { WindowControl } from '../../cloudmusic';


export function minimize() {
    ipcRenderer.send('window-minimize');
}

export function maximize() {
    ipcRenderer.send('window-maximize');
}

export function close() {
    ipcRenderer.send('window-close');
}

export function onLoginSuccess(callback: () => void) {
    ipcRenderer.on('login-success', () => callback());
}

export const saveResources = process.env.NODE_ENV === 'development' && !!process.env['SAVE_RESOURCES'];

const windowControl: WindowControl = {
    minimize,
    maximize,
    close,
    saveResources,
    onLoginSuccess,
};

export default windowControl;
