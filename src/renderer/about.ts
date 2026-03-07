import './index.scss';


const RELEASE_URL = 'https://github.com/web1n/cloudmusic/releases';

function parseQuery() {
    const query = new URLSearchParams(window.location.search);

    return {
        version: query.get('version') || 'Unknown',
    };
}

function initVersionElements() {
    document.getElementById('version').textContent = version;
    document.getElementById('check-update').addEventListener('click', () => {
        window.open(RELEASE_URL, '_blank');
    });
}

const { version } = parseQuery();

(() => {
    initVersionElements();
})();
