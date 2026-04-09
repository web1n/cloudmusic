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

const windowControl: WindowControl = {
    minimize,
    maximize,
    close,
    onLoginSuccess,
};

export default windowControl;
