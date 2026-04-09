export function hookMediaSessionActionHandler() {
    const originalSetHandler = MediaSession.prototype.setActionHandler;
    window.mediaControlHandlers = {};

    window.mediaControl.onPlay((action) => {
        const handler = window.mediaControlHandlers[action];

        if (typeof handler === 'function') {
            try {
                handler({ action: action });
            } catch (error) {
                console.error(`Error invoking media session action handler for ${action}:`, error);
            }
        } else {
            console.warn(`No media session action handler registered for ${action}`);
        }
    });

    navigator.mediaSession.setActionHandler = function (action, handler) {
        console.log(`Setting media session action handler for ${action}`);
        const valid = typeof handler === 'function';

        window.mediaControlHandlers[action] = handler;
        window.mediaControl.setMediaControlAvailable(action, valid);

        originalSetHandler.apply(this, [action, handler]);
    };
}

export function hookMediaSessionMetadataSetter() {
    const descriptor = Object.getOwnPropertyDescriptor(MediaSession.prototype, 'metadata')!!;
    Object.defineProperty(navigator.mediaSession, 'metadata', {
        set(value) {
            const plainMetadata = value != null ? {
                title: value.title,
                artist: value.artist,
                album: value.album,
                artwork: value.artwork,
            } : null;
            window.mediaControl.setCurrentMetadata(plainMetadata);

            return descriptor.set!!.call(this, value);
        },
        get() {
            return descriptor.get!!.call(this);
        },
        configurable: true,
        enumerable: true
    });
}

export function hookMediaSessionPlayPause() {
    const originalPlay = HTMLAudioElement.prototype.play;
    const originalPause = HTMLAudioElement.prototype.pause;

    HTMLAudioElement.prototype.play = function () {
        window.mediaControl.setPlayStatus(true);
        return originalPlay.apply(this);
    };
    HTMLAudioElement.prototype.pause = function () {
        window.mediaControl.setPlayStatus(false);
        return originalPause.apply(this);
    };
}
