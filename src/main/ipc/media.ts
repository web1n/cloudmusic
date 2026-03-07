import { ipcMain } from "electron";
import { initMediaControl, setControlAvailable, setMediaMetadata, setPlaying } from "../media";
import { isCallFromMainWindow } from "./index";


const MEDIA_IPC_HANDLERS = {
    'init-media-control': () => initMediaControl(),
    'media-control-available': (action: MediaSessionAction, available: boolean) => setControlAvailable(action, available),
    'set-current-metadata': (metadata: MediaMetadata | null) => setMediaMetadata(metadata),
    'set-play-status': (playing: boolean) => setPlaying(playing),
} as const;

export function registerMediaControlIPCHandlers() {
    const entries = Object.entries(MEDIA_IPC_HANDLERS) as [keyof typeof MEDIA_IPC_HANDLERS, Function][];

    for (const [channel, handler] of entries) {
        ipcMain.on(channel, (event, ...args) => {
            if (!isCallFromMainWindow(event, channel)) return;

            try {
                return handler(...args);
            } catch (error) {
                console.error(`Error handling IPC channel ${channel}:`, error);
            }
        });
    }
}
