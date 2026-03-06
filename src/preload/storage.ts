export function initLocalStorageHook() {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

    const UPLOAD_CONFIG_KEY_LIST = [
        'setting',
    ];

    localStorage.setItem = function (key, value) {
        const event = new CustomEvent('setStorageItem', { detail: { key, value } });
        window.dispatchEvent(event);

        if (UPLOAD_CONFIG_KEY_LIST.includes(key) && typeof value === 'string') {
            window.App.saveEncryptedConfig(key, value);
        }

        originalSetItem.apply(this, arguments);
    };
    localStorage.removeItem = function (key) {
        const event = new CustomEvent('removeStorageItem', { detail: { key } });
        window.dispatchEvent(event);

        originalRemoveItem.apply(this, arguments);
    };
}
