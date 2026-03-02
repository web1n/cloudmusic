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

console.log('Initializing injection script');

(function () {
    initCallbacks();

    if (window.windowControl.platform !== 'darwin') {
        waitForElement(NAVBAR_SELECTOR, initWindowControls);
    }
})();
