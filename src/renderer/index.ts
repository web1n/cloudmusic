import './index.scss';

export function initCloseButton() {
    const closeButton = document.getElementById('close');
    closeButton.addEventListener('click', () => window.windowControl.close());
}
