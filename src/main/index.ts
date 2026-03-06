import { app } from 'electron';
import { createShowWindow, showWindow } from './window';
import { createTray } from './tray';
import { registerIPCHandlers } from './ipc';
import { controlPlay } from './media';
import { handleSaveResources, handleHttpRequest } from './resources';
import { getConfig } from './configs';


const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    console.log('Another instance is already running, exiting.');
    app.quit();
    process.exit(0);
}

app.on('second-instance', (_event, commandLine) => {
    console.log('Second instance launched with command line:', commandLine);

    if (commandLine.includes('--play')) {
        controlPlay('play');
    } else if (commandLine.includes('--pause')) {
        controlPlay('pause');
    } else if (commandLine.includes('--nexttrack')) {
        controlPlay('nexttrack');
    } else if (commandLine.includes('--previoustrack')) {
        controlPlay('previoustrack');
    } else {
        showWindow('main');
    }
});

if (!getConfig('setting.hardware-acceleration', true)) {
    console.log('Hardware acceleration is disabled by config, disabling it for Electron');
    app.disableHardwareAcceleration();
}

app.whenReady().then(() => {
    if (process.env.NODE_ENV === 'development' && process.env['SAVE_RESOURCES']) {
        handleSaveResources();
    } else {
        handleHttpRequest();
    }

    createTray();
    registerIPCHandlers();
    createShowWindow('main');
});

app.on('window-all-closed', function () {
    app.quit();
});
