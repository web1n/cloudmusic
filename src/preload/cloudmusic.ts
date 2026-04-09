import { exposeApi } from './api';
import { initHook } from './hook';
import { insertCss } from './css';
import { initMediaControl } from './api/media';


exposeApi('App', 'mediaControl', 'windowControl');
initHook(
    'LocalStorageSetter',
    'MediaSessionActionHandler',
    'MediaSessionMetadataSetter',
    'MediaSessionPlayPause'
);
insertCss('cloudmusic');

initMediaControl();
