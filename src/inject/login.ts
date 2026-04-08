import { waitForElement } from './dom';
import style from './login.scss?inline';


const IFRAME_SELECTOR = 'iframe[name="contentFrame"]';
const QRCODE_CONTAINER_SELECTOR = 'canvas[height="256"]';

function injectStyle(doc: Document) {
    const styleElement = document.createElement('style');
    styleElement.textContent = style;

    doc.head.appendChild(styleElement)
}

console.log('Initializing injection script');

(async function () {
    const iframe = await waitForElement<HTMLIFrameElement>(IFRAME_SELECTOR);
    const iframeDocument = iframe.contentDocument!!;
    console.log('Found login iframe:', iframe);

    injectStyle(iframeDocument);

    const qrcodeContainer = (await waitForElement(QRCODE_CONTAINER_SELECTOR, iframeDocument));
    console.log('Found QR code container:', qrcodeContainer);
    qrcodeContainer.classList.add('qrcode-container');
})();
