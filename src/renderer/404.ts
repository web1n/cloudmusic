import './index.scss';


function parseQuery() {
    const query = new URLSearchParams(window.location.search);

    return {
        errorCode: query.get('errorCode')!!,
        errorDescription: query.get('errorDescription')!!,
        url: query.get('url')!!,
    };
}

const { errorCode, errorDescription, url } = parseQuery();
const online = navigator.onLine;

(() => {
    console.log(`Failed to load ${url}, errorCode: ${errorCode}, errorDescription: ${errorDescription}`);

    const errorCodeElement = document.getElementById('error-code');
    const errorDescriptionElement = document.getElementById('error-description');
    const reloadElement = document.getElementById('reload');

    if (errorCodeElement) errorCodeElement.textContent = `Error Code: ${errorCode}`;
    if (errorDescriptionElement) errorDescriptionElement.textContent = errorDescription;
    if (reloadElement) reloadElement.addEventListener('click', () => window.location.href = url);

    if (!online) window.addEventListener('online', () => {
        console.log('Network reconnected, reloading page...');
        setTimeout(() => window.location.href = url, 3000);
    });
})();
