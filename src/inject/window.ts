export const NAVBAR_SELECTOR = '#page_pc_main_nav';
const CONTROL_CONTAINER_ID = 'electron-window-controls';

const CONTROL_BUTTONS: { action: string; label: string; title: string }[] = [
    { action: 'minimize', label: '−', title: '最小化' },
    { action: 'maximize', label: '□', title: '最大化' },
    { action: 'close', label: '×', title: '关闭' },
];

export function initWindowControls() {
    const nav = document.querySelector(NAVBAR_SELECTOR);
    if (!nav) {
        console.warn('Navigation bar not found, cannot inject window controls');
        return;
    }

    const existingContainer = document.getElementById(CONTROL_CONTAINER_ID);
    if (existingContainer) return;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = CONTROL_CONTAINER_ID;

    CONTROL_BUTTONS.forEach((btn) => {
        const button = document.createElement('span');
        button.title = btn.title;
        button.textContent = btn.label;

        button.id = `electron-${btn.action}`;
        button.className = 'icon electron-window-button';

        button.onclick = () => {
            switch (btn.action) {
                case 'minimize':
                    return window.windowControl.minimize();
                case 'maximize':
                    return window.windowControl.maximize();
                case 'close':
                    return window.windowControl.close();
            }
        };

        buttonsContainer.appendChild(button);
    });

    nav.appendChild(buttonsContainer);
}
