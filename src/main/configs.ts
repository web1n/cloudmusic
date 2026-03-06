import Configstore from 'configstore';


const config = new Configstore('cloudmusic', {
    setting: {
        'hardware-acceleration': '1',
    },
    local: {
        'autoRunShowType': 'minisize',
        'showPlayDesktopNotify': true,
    }
});

export const VALID_LOCAL_CONFIG_KEYS: string[] = [
    'autoRunShowType',
    'showPlayDesktopNotify',
];

export function getConfig<T extends string>(key: string, defaultValue: T): string;
export function getConfig<T extends boolean>(key: string, defaultValue: T): boolean;
export function getConfig<T>(key: string, defaultValue: T): T;
export function getConfig<T>(key: string): T | undefined;

export function getConfig<T>(key: string, defaultValue?: T): T | undefined {
    const value: unknown = config.get(key);

    if (value === undefined) {
        return defaultValue;
    }

    if (typeof defaultValue === 'boolean' && typeof value === 'string') {
        const typedValue = value === '1' || value === 'true';
        return typedValue as T;
    }

    return value as T;
}

export function setConfig(key: string, value: any): void {
    config.set(key, value);
}

export function deleteConfig(key: string): void {
    config.delete(key);
}
