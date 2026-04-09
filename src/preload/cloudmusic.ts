import { exposeApi } from './api';
import { initHook } from './hook';
import { insertCss } from './css';
import { waitForElement } from './utils/dom';
import { initWindowControls, NAVBAR_SELECTOR } from './utils/window';
import { DEVELOPMENT, SAVE_RESOURCES } from './utils/env';
import { onLoginSuccess } from './api/window';
import { initMediaControl } from './api/media';
import { exitApp, getLocalConfig } from './api/app';


async function initElements() {
    const useSystemDecorations = await getLocalConfig({ type: 'local', key: 'useSystemDecorations' }) === true;
    if (!useSystemDecorations) initWindowControls();

    if (DEVELOPMENT && SAVE_RESOURCES) {
        setTimeout(() => (document.querySelector('span[aria-label="setting"]') as HTMLElement)?.click(), 3000);
        setTimeout(() => exitApp('exit'), 6000);
    }
}

exposeApi('App', 'mediaControl', 'windowControl');
initHook(
    'LocalStorageSetter',
    'MediaSessionActionHandler',
    'MediaSessionMetadataSetter',
    'MediaSessionPlayPause'
);
insertCss('cloudmusic');

initMediaControl();
onLoginSuccess(() => window.location.reload());

window.addEventListener('DOMContentLoaded', () => {
    waitForElement(NAVBAR_SELECTOR).then(() => initElements());
});
