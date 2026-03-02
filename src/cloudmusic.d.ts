declare global {
    interface Window {
        windowControl: WindowControl;
        mediaControl: MediaControl;
        channel: Channel;
        mediaControlHandlers: { [key in MediaSessionAction]?: MediaSessionActionHandler | null };
    }
}

declare global {
    namespace Electron {
        interface App {
            isQuitting?: boolean;
        }
    }
}

export type WindowControl = {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    platform: NodeJS.Platform;
    onLoginSuccess: (callback: () => void) => void;
};

export type MediaControl = {
    initMediaControl: () => void;
    setMediaControlAvailable: (action: MediaSessionAction, available: boolean) => void;
    setCurrentMetadata: (metadata: MediaMetadata | null) => void;
    setPlayStatus: (playing: boolean) => void;
    onPlay: (callback: (action: MediaSessionAction) => void) => void;
};

export type Channel = {
    call: (command: string, callback: any, params: any) => void;
    registerCall: (command: string, callback: any) => void;
    viewCall: (...command: any) => void;
};

export type StorageItemChangeEvent = CustomEvent<{ key: string; value: any }>;
export type StorageItemRemoveEvent = CustomEvent<{ key: string }>;
