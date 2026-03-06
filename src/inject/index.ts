import { waitForElement } from './dom';
import { controlPlay } from './media';
import { initWindowControls, NAVBAR_SELECTOR } from './window';


function initCallbacks() {
    window.windowControl.onLoginSuccess(() => {
        console.log('Login successful, reloading main window');
        window.location.reload();
    });
    window.mediaControl.onPlay((action) => controlPlay(action));
}

function initElements() {
    initWindowControls();

    if (window.windowControl.saveResources) {
        setTimeout(() => (document.querySelector('span[aria-label="setting"]') as HTMLElement)?.click(), 3000);
        setTimeout(() => window.App.exitApp('exit'), 6000);
    }
}

console.log('Initializing injection script');

(function () {
    initCallbacks();
    waitForElement(NAVBAR_SELECTOR, () => initElements());
})();
