import { Notification } from 'electron';
import { sendIpc } from './window';
import { updateTray } from './tray';


const BASIC_MEDIA_SESSION_ACTIONS = ['play', 'pause', 'previoustrack', 'nexttrack'] as const;

const currentStatus = {
    playing: false,
    metadata: null as MediaMetadata | null,
    controlAvailable: {} as { [key in MediaSessionAction]?: boolean },
}

function updateNotification() {
    if (!isPlaying() || !getMediaMetadata()) return;

    const notification = new Notification({
        title: getMediaMetadata().title,
        body: getMediaMetadata().artist,
        silent: true,
    });
    notification.show();
}

export function initMediaControl() {
    console.log('Initializing media control');

    currentStatus.playing = false;
    currentStatus.metadata = null;
    currentStatus.controlAvailable = {};

    updateTray();
}

export function isPlaying() {
    return currentStatus.playing;
}

export function setPlaying(playing: boolean) {
    console.log(`Setting media playing state to ${playing}`);
    if (currentStatus.playing === playing) return;

    currentStatus.playing = playing;
    updateTray();
}

export function getMediaMetadata() {
    return currentStatus.metadata;
}

export function setMediaMetadata(metadata: MediaMetadata | null) {
    console.log('Setting media metadata', metadata);
    if (JSON.stringify(currentStatus.metadata) === JSON.stringify(metadata)) return;

    currentStatus.metadata = metadata;
    updateTray();
    updateNotification();
}

export function setControlAvailable(action: MediaSessionAction, available: boolean) {
    console.log(`Setting media control availability for ${action} to ${available}`);
    if (currentStatus.controlAvailable[action] === available) return;

    currentStatus.controlAvailable[action] = available;
    updateTray();
}

export function isBasicControlAvailable(): boolean {
    return BASIC_MEDIA_SESSION_ACTIONS.every(key => isControlAvailable(key));
}

export function isControlAvailable(action: MediaSessionAction): boolean {
    return !!currentStatus.controlAvailable[action];
}

export function togglePlay() {
    controlPlay(isPlaying() ? 'pause' : 'play');
}

export function controlPlay(action: MediaSessionAction) {
    if (!isControlAvailable(action)) {
        console.warn(`Media control for action ${action} is not available`);
        return;
    }
    if (isPlaying() && action === 'play' || !isPlaying() && action === 'pause') {
        console.log(`Media is already in the desired state for action ${action}`);
        return;
    }

    sendIpc('main', 'media-control', action);
}
