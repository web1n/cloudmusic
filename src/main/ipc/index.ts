import { registerAppIPCHandlers } from "./app";
import { registerMediaControlIPCHandlers } from "./media";
import { registerWindowControlIPCHandlers } from "./window";


export function registerIPCHandlers() {
    registerAppIPCHandlers();
    registerMediaControlIPCHandlers();
    registerWindowControlIPCHandlers();
}
