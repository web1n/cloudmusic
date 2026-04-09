import { webFrame } from 'electron';
import style from './css/login.scss?inline';


window.addEventListener('DOMContentLoaded', () => {
    webFrame.insertCSS(style);
});
