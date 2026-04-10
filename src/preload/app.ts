import { exposeApi } from './api';
import { close } from './api/window';


export function initCloseButton() {
    const closeButton = document.getElementById('close');

    closeButton?.addEventListener('click', () => close());
}

exposeApi('App', 'Login', 'windowControl');

window.addEventListener('DOMContentLoaded', () => {
    initCloseButton();
});
