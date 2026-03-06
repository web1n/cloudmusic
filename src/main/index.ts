import { BrowserWindow, app } from 'electron';
import { createShowWindow, showWindow } from './window';
import { createTray } from './tray';
import { registerIPCHandlers } from './ipcHandler';
import { controlPlay } from './media';
import { handleSaveResources, handleHttpRequest } from './resources';


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

app.whenReady().then(() => {
    if (process.env.NODE_ENV === 'development' && process.env['SAVE_RESOURCES']) {
        handleSaveResources();
    } else {
        handleHttpRequest();
    }

    createTray();
    registerIPCHandlers();
    createShowWindow('main');

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createShowWindow('main');
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
