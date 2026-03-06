declare global {
    interface Window {
        windowControl: WindowControl;
        mediaControl: MediaControl;
        App: App;
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
    saveResources: boolean;
    onLoginSuccess: (callback: () => void) => void;
};

export type MediaControl = {
    initMediaControl: () => void;
    setMediaControlAvailable: (action: MediaSessionAction, available: boolean) => void;
    setCurrentMetadata: (metadata: MediaMetadata | null) => void;
    setPlayStatus: (playing: boolean) => void;
    onPlay: (callback: (action: MediaSessionAction) => void) => void;
};

export type StorageItemChangeEvent = CustomEvent<{ key: string; value: any }>;
export type StorageItemRemoveEvent = CustomEvent<{ key: string }>;

export type App = {
    exitApp: (type: string) => void;
};
