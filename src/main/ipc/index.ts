import { registerMediaControlIPCHandlers } from "./media";
import { registerWindowControlIPCHandlers } from "./window";


export function registerIPCHandlers() {
    registerMediaControlIPCHandlers();
    registerWindowControlIPCHandlers();
}
