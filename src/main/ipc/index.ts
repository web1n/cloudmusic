import { BrowserWindow, IpcMainEvent } from "electron";
import { registerAppIPCHandlers } from "./app";
import { registerLoginIPCHandlers } from "./login";
import { registerMediaControlIPCHandlers } from "./media";
import { registerWindowControlIPCHandlers } from "./window";
import { getWindowType } from "../window";


export function isCallFromMainWindow(event: IpcMainEvent, funcName?: string) {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return false;

    const isMain = getWindowType(window) === 'main';
    if (!isMain) console.warn(`IPC call ${funcName ? `'${funcName}'` : ''} from non-main window (type: ${getWindowType(window)}) blocked.`);
    return isMain;
}

export function registerIPCHandlers() {
    registerAppIPCHandlers();
    registerLoginIPCHandlers();
    registerMediaControlIPCHandlers();
    registerWindowControlIPCHandlers();
}
