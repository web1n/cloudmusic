import { close, maximize, minimize } from "../api/window";


export const NAVBAR_SELECTOR = '#page_pc_main_nav';
const CONTROL_CONTAINER_ID = 'electron-window-controls';

const CONTROL_BUTTONS: { action: string; title: string; }[] = [
    { action: 'minimize', title: '最小化' },
    { action: 'maximize', title: '最大化' },
    { action: 'close', title: '关闭' },
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
    buttonsContainer.className = 'electron-window-controls';

    CONTROL_BUTTONS.forEach(({ action, title }) => {
        const button = document.createElement('span');
        button.title = title;
        button.className = `electron-window-button ${action}`;

        button.onclick = () => {
            switch (action) {
                case 'minimize':
                    return minimize();
                case 'maximize':
                    return maximize();
                case 'close':
                    return close();
            }
        };

        buttonsContainer.appendChild(button);
    });

    nav.appendChild(buttonsContainer);
}
