import { initCloseButton } from './index';

const RELEASE_URL = 'https://github.com/web1n/cloudmusic/releases';

function parseQuery() {
    const query = new URLSearchParams(window.location.search);

    return {
        version: query.get('version') || 'Unknown',
    };
}

async function initConfigElements() {
    for (const checkbox of document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>) {
        checkbox.checked = await window.App.getLocalConfig({ type: 'local', key: checkbox.id }) === true;

        checkbox.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;

            console.log(`Checkbox ${target.id} changed to ${target.checked}`);
            window.App.setLocalConfig({ type: 'local', key: target.id, value: target.checked });

            if (confirm('重启软件以应用更改')) window.App.exitApp('restart');
        });
    }
}

function initVersionElements() {
    document.getElementById('version').textContent = version;
    document.getElementById('check-update').addEventListener('click', () => {
        window.open(RELEASE_URL, '_blank');
    });
}

const { version } = parseQuery();

(() => {
    initCloseButton();
    initVersionElements();
    initConfigElements();
})();
