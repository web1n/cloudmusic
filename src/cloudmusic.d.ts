declare global {
    interface Window {
        windowControl: WindowControl;
        mediaControl: MediaControl;
        App: App;
        Login: Login;
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
    onLoginSuccess: (callback: () => void) => void;
};

export type MediaControl = {
    initMediaControl: () => void;
    setMediaControlAvailable: (action: MediaSessionAction, available: boolean) => void;
    setCurrentMetadata: (metadata: MediaMetadata | null) => void;
    setPlayStatus: (playing: boolean) => void;
    onPlay: (callback: (action: MediaSessionAction) => void) => void;
};

export type App = {
    getLocalConfig: (request: { type: string; key: string }) => Promise<any>;
    setLocalConfig: (request: { type: string; key: string; value: any }) => void;
    exitApp: (type: string) => void;
    setAutoStart: (enable: boolean) => void;
    isAutoStart: () => boolean;
    saveEncryptedConfig: (key: string, value: string) => void;
    localFonts: string[];
};

export type QrCodeLoginStatus = 'expired' | 'waiting' | 'scanned' | 'authorized' | 'failed';

export type Login = {
    generateUnikey: () => Promise<{ unikey: string; url: string }>;
    checkLoginStatus(unikey: string): Promise<{ status: QrCodeLoginStatus; message?: string }>;
    getUserProfile(): Promise<{ userId: string; nickname: string; avatarUrl: string }>;
    setLoginViewBounds(bounds: { x: number; y: number; width: number; height: number }): void;
};
