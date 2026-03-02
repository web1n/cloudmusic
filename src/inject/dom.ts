export function waitForElement(selector: string, callback: (element: Element) => void) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
        return;
    }

    const observer = new MutationObserver((_mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            obs.disconnect();
            callback(element);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}
