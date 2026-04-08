import { registerAppIPCHandlers } from "./app";
import { registerLoginIPCHandlers } from "./login";
import { registerMediaControlIPCHandlers } from "./media";
import { registerWindowControlIPCHandlers } from "./window";


export function registerIPCHandlers() {
    registerAppIPCHandlers();
    registerLoginIPCHandlers();
    registerMediaControlIPCHandlers();
    registerWindowControlIPCHandlers();
}
