import { initCloseButton } from './index';
import './login.scss';

import qrcode from 'qrcode';
import type { QrCodeLoginStatus } from '../cloudmusic';


const STATUS_TEXTS: { [key in QrCodeLoginStatus]?: string } = {
    scanned: '二维码已扫描，请确认登录',
    expired: '二维码已过期',
    authorized: '登录成功',
};

let loginCheckInterval: NodeJS.Timeout | null = null;

function showQrCodeMask(show: boolean) {
    const qrcodeMask = document.getElementById('qrcodeMask');

    if (show) {
        qrcodeMask.classList.add('active');
    } else {
        qrcodeMask.classList.remove('active');
    }
}

function showReloadButton(show: boolean) {
    const reloadButton = document.getElementById('reload');

    reloadButton.classList.toggle('d-none', !show);
}

function showStatus(message: string, err: boolean = false) {
    const statusMessage = document.getElementById('status');
    statusMessage.textContent = message;

    showQrCodeMask(true);
    showReloadButton(err);
    if (err) clearLoginCheckInterval();
}

async function updateQrCodeContent(content: string) {
    const data = await qrcode.toDataURL(content, { width: 200, margin: 2 });

    const qrcodeContainer = document.getElementById('qrcode') as HTMLImageElement;
    qrcodeContainer.src = data;
}

function clearLoginCheckInterval() {
    if (loginCheckInterval) clearInterval(loginCheckInterval);

    console.log('Cleared login check interval');
    loginCheckInterval = null;
}

async function checkLogin(unikey: string) {
    let status: QrCodeLoginStatus;
    let message: string | undefined;
    try {
        ({ status, message } = await window.Login.checkLoginStatus(unikey));
    } catch (error) {
        console.error('Error checking login status:', error);
        showStatus(error || '检查登录状态失败', true);
        return;
    }
    console.log('Checked login status:', status, message);

    if (status !== 'waiting') {
        showStatus(
            STATUS_TEXTS[status] || message || status,
            status === 'expired' || status === 'failed'
        );
    }

    if (status !== 'waiting' && status !== 'scanned') {
        clearLoginCheckInterval();
    }
    if (status === 'authorized') {
        window.close();
    }
}

async function showLoginQrCode() {
    let unikey: string;
    let url: string;
    try {
        ({ unikey, url } = await window.Login.generateUnikey());
    } catch (error) {
        console.error('Error generating unikey:', error);
        showStatus(error.message || '获取登录二维码失败', true);
        return;
    }
    console.log('Generated unikey:', unikey, url);

    await updateQrCodeContent(url);
    showQrCodeMask(false);

    return unikey;
}

async function checkUserProfile() {
    try {
        const profile = await window.Login.getUserProfile();
        console.log('User profile:', profile);

        window.close();
    } catch (_) {
    }
}

(async () => {
    initCloseButton();

    document.getElementById('reload').addEventListener('click', () => {
        window.location.reload();
    });

    await checkUserProfile();
    const unikey = await showLoginQrCode();
    loginCheckInterval = setInterval(async () => await checkLogin(unikey), 2000);
})();
