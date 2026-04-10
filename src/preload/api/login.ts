import { ipcRenderer } from 'electron';
import { Login } from '../../cloudmusic';


export function generateUnikey() {
    return ipcRenderer.invoke('generate-unikey');
}

export function checkLoginStatus(chainId: string, unikey: string) {
    return ipcRenderer.invoke('check-login-status', chainId, unikey);
}

export function getUserProfile() {
    return ipcRenderer.invoke('get-user-profile');
}

export function setLoginViewBounds(bounds: { x: number; y: number; width: number; height: number }) {
    ipcRenderer.send('set-login-view-bounds', bounds);
}

const Login: Login = {
    generateUnikey,
    checkLoginStatus,
    getUserProfile,
    setLoginViewBounds
}

export default Login;
