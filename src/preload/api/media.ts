import { ipcRenderer } from 'electron';
import { MediaControl } from '../../cloudmusic';


export function initMediaControl() {
    ipcRenderer.send('init-media-control');
}

export function setMediaControlAvailable(action: MediaSessionAction, available: boolean) {
    ipcRenderer.send('media-control-available', action, available);
}

export function setCurrentMetadata(metadata: MediaMetadata | null) {
    ipcRenderer.send('set-current-metadata', metadata);
}

export function setPlayStatus(playing: boolean) {
    ipcRenderer.send('set-play-status', playing);
}

export function onPlay(callback: (action: MediaSessionAction) => void) {
    ipcRenderer.on('media-control', (_, action) => callback(action));
}

const mediaControl: MediaControl = {
    initMediaControl,
    setMediaControlAvailable,
    setCurrentMetadata,
    setPlayStatus,
    onPlay
};

export default mediaControl;
