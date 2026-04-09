import { contextBridge } from 'electron';
import { hookLocalStorageSetter } from './localstorage';
import {
    hookMediaSessionActionHandler,
    hookMediaSessionMetadataSetter,
    hookMediaSessionPlayPause
} from './mediasession';


const HOOK_TYPES = {
    LocalStorageSetter: hookLocalStorageSetter,
    MediaSessionActionHandler: hookMediaSessionActionHandler,
    MediaSessionMetadataSetter: hookMediaSessionMetadataSetter,
    MediaSessionPlayPause: hookMediaSessionPlayPause,
} as const;

export type HookType = keyof typeof HOOK_TYPES;

export function initHook(...types: HookType[]) {
    for (const type of types) {
        console.log(`Initializing ${type} hook`);
        contextBridge.executeInMainWorld({ func: HOOK_TYPES[type] });
    }
}
