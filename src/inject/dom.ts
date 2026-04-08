export function waitForElement<T extends Element = Element>(
    selector: string, dom: Document = document
): Promise<T> {
    return new Promise((resolve) => {
        const element = dom.querySelector(selector);
        if (element) {
            resolve(element as T);
            return;
        }

        const observer = new MutationObserver((_mutations, obs) => {
            const matchedElement = dom.querySelector(selector);
            if (matchedElement) {
                obs.disconnect();
                resolve(matchedElement as T);
            }
        });

        observer.observe(dom.documentElement, {
            childList: true,
            subtree: true,
        });
    });
}
