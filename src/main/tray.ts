import { Tray, Menu, Notification, MenuItemConstructorOptions, app, nativeImage } from 'electron';
import { showWindow } from './window';
import { controlPlay, togglePlay, getMediaMetadata, isPlaying, isBasicControlAvailable } from './media';
import appIcon from '../../resources/icon.png';


const icon = nativeImage.createFromDataURL(appIcon);
let tray: Tray | null = null;

export function updateTray() {
    if (!tray) return;

    const menuTemplate: MenuItemConstructorOptions[] = [];

    const basicControlAvailable = isBasicControlAvailable();
    const metadata = getMediaMetadata();

    if (basicControlAvailable) {
        menuTemplate.push({ type: 'separator' });

        if (metadata) {
            const title = `${metadata.title} - ${metadata.artist}`;
            menuTemplate.push({ label: title, enabled: false });
        }

        if (!isPlaying()) {
            menuTemplate.push({ label: '播放', click: () => controlPlay('play') });
        } else {
            menuTemplate.push({ label: '暂停', click: () => controlPlay('pause') });
        }

        menuTemplate.push({ label: '上一曲', click: () => controlPlay('previoustrack') });
        menuTemplate.push({ label: '下一曲', click: () => controlPlay('nexttrack') });
    }

    const contextMenu = Menu.buildFromTemplate([
        { label: '显示窗口', click: () => showWindow('main') },
        ...menuTemplate,
        { type: 'separator' },
        {
            label: '退出',
            click: () => {
                app.isQuitting = true;
                app.quit();
            },
        },
    ]);
    tray.setContextMenu(contextMenu);
}

export function createTray() {
    tray = new Tray(icon);
    tray.setToolTip('网易云音乐');
    tray.on('click', () => togglePlay());

    updateTray();
}

export function showHideNotification() {
    const tips = new Notification({
        title: '网易云音乐',
        body: '应用已隐藏到系统托盘',
    });
    tips.show();
}
