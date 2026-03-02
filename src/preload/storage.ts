export function initLocalStorageHook() {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function (key, value) {
        const event = new CustomEvent('setStorageItem', { detail: { key, value } });
        window.dispatchEvent(event);

        originalSetItem.apply(this, arguments);
    };
    localStorage.removeItem = function (key) {
        const event = new CustomEvent('removeStorageItem', { detail: { key } });
        window.dispatchEvent(event);

        originalRemoveItem.apply(this, arguments);
    };
}
