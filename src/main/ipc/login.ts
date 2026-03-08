import { ipcMain } from "electron";
import { generateUnikey, checkQrCodeStatus, getUserProfile } from "../login";
import { sendIpc } from "../window";
import type { QrCodeLoginStatus } from "../../cloudmusic";


async function handleGenerateUnikey() {
    console.log('Handling generate unikey request');

    return await generateUnikey();
}

async function handleCheckLoginStatus(unikey: string): Promise<{ status: QrCodeLoginStatus; message?: string }> {
    console.log('Handling check login status request for unikey:', unikey);

    const { status, message } = await checkQrCodeStatus(unikey);

    if (status === 'authorized') {
        sendIpc('main', 'login-success');
    }

    return { status, message };
}

async function handleGetUserProfile() {
    console.log('Handling get user profile');

    return await getUserProfile();
}

export function registerLoginIPCHandlers() {
    ipcMain.handle('generate-unikey', async (_) => await handleGenerateUnikey());
    ipcMain.handle('check-login-status', async (_, unikey) => await handleCheckLoginStatus(unikey));
    ipcMain.handle('get-user-profile', async (_) => await handleGetUserProfile());
}
