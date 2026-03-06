export function initLocalStorageHook() {
    const originalSetItem = localStorage.setItem;

    const UPLOAD_CONFIG_KEY_LIST = [
        'setting',
        'autoRunShowType'
    ];

    localStorage.setItem = function (key, value) {
        if (UPLOAD_CONFIG_KEY_LIST.includes(key) && typeof value === 'string') {
            window.App.saveEncryptedConfig(key, value);
        }

        originalSetItem.apply(this, arguments);
    };

}
