export function controlPlay(action: MediaSessionAction): boolean {
    const handler = window.mediaControlHandlers[action];
    if (typeof handler !== 'function') {
        console.warn(`No media session action handler registered for ${action}`);
        return false;
    }

    console.log(`Invoking media session action handler for ${action}`);
    try {
        handler({ action: action });
    } catch (error) {
        console.error(`Error invoking media session action handler for ${action}:`, error);
        return false;
    }
    return true;
}
