import { BrowserWindow, IpcMainEvent, ipcMain } from "electron";
import { generateUnikey, checkQrCodeStatus, getUserProfile } from "../login";
import { sendIpc } from "../window";
import type { QrCodeLoginStatus } from "../../cloudmusic";
import { setLoginViewBounds } from "../window/login";


async function handleGenerateUnikey() {
    console.log('Handling generate unikey request');

    return await generateUnikey();
}

async function handleCheckLoginStatus(chainId: string, unikey: string): Promise<{ status: QrCodeLoginStatus; message?: string }> {
    console.log('Handling check login status request for unikey:', unikey);

    const { status, message } = await checkQrCodeStatus(chainId, unikey);

    if (status === 'authorized') {
        sendIpc('main', 'login-success');
    }

    return { status, message };
}

async function handleGetUserProfile() {
    console.log('Handling get user profile');

    return await getUserProfile();
}

function onSetLoginViewBounds(
    event: IpcMainEvent,
    bounds: { x: number; y: number; width: number; height: number }
) {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    setLoginViewBounds(window, bounds);
}

export function registerLoginIPCHandlers() {
    ipcMain.handle('generate-unikey', async (_) => await handleGenerateUnikey());
    ipcMain.handle('check-login-status', async (_, chainId, unikey) => await handleCheckLoginStatus(chainId, unikey));
    ipcMain.handle('get-user-profile', async (_) => await handleGetUserProfile());
    ipcMain.on('set-login-view-bounds', onSetLoginViewBounds);
}
