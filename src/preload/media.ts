export function initMediaSessionHook() {
    console.log('Initializing media session handler');
    window.mediaControl.initMediaControl();

    // hook media session action handler
    const originalSetHandler = MediaSession.prototype.setActionHandler;
    window.mediaControlHandlers = {};

    navigator.mediaSession.setActionHandler = function (action, handler) {
        console.log(`Setting media session action handler for ${action}`);
        const valid = typeof handler === 'function';

        window.mediaControlHandlers[action] = handler;
        window.mediaControl.setMediaControlAvailable(action, valid);

        originalSetHandler.apply(this, [action, handler]);
    };

    // hook media session metadata setter
    const descriptor = Object.getOwnPropertyDescriptor(MediaSession.prototype, 'metadata');
    Object.defineProperty(navigator.mediaSession, 'metadata', {
        set(value) {
            const plainMetadata = value != null ? {
                title: value.title,
                artist: value.artist,
                album: value.album,
                artwork: value.artwork,
            } : null;
            window.mediaControl.setCurrentMetadata(plainMetadata);

            return descriptor.set.call(this, value);
        },
        get() {
            return descriptor.get.call(this);
        },
        configurable: true,
        enumerable: true
    });

    // hook play and pause method
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
