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
    const qrcodeMask = document.getElementById('qrcodeMask')!!;

    if (show) {
        qrcodeMask.classList.add('active');
    } else {
        qrcodeMask.classList.remove('active');
    }
}

function showReloadButton(show: boolean) {
    const reloadButton = document.getElementById('reload')!!;

    reloadButton.classList.toggle('d-none', !show);
}

function showStatus(message: string, err: boolean = false) {
    const statusMessage = document.getElementById('status')!!;
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
    } catch (error: any) {
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
        window.windowControl.close();
    }
}

async function showLoginQrCode(url: string) {
    await updateQrCodeContent(url);
    showQrCodeMask(false);
}

async function checkUserProfile() {
    try {
        const profile = await window.Login.getUserProfile();
        console.log('User profile:', profile);

        window.windowControl.close();
    } catch (_) {
    }
}

function syncLoginViewBounds() {
    const container = document.querySelector('.qrcode')!!;
    const rect = container.getBoundingClientRect();

    const bounds = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
    };
    console.log('Syncing login view bounds', bounds);
    window.Login.setLoginViewBounds(bounds);
}

function initIFrameLogin() {
    const observer = new ResizeObserver(() => syncLoginViewBounds());
    observer.observe(document.body);

    requestAnimationFrame(() => syncLoginViewBounds());
}

async function initApiLogin() {
    let unikey: string;
    let url: string;
    try {
        ({ unikey, url } = await window.Login.generateUnikey());
    } catch (error: any) {
        console.error('Error generating unikey:', error);
        showStatus(error || '获取登录二维码失败', true);
        return;
    }

    console.log('Generated unikey:', unikey, url);
    showLoginQrCode(url);

    loginCheckInterval = setInterval(async () => await checkLogin(unikey), 2000);
}

function initReloadButton() {
    const reloadButton = document.getElementById('reload')!!;

    reloadButton.addEventListener('click', () => window.location.reload());
}

(async () => {
    initCloseButton();
    initReloadButton();

    await checkUserProfile();

    const useIFrameLogin = await window.App.getLocalConfig({ type: 'local', key: 'useIFrameLogin' });
    if (useIFrameLogin) {
        initIFrameLogin();
    } else {
        initApiLogin();
    }
})();
