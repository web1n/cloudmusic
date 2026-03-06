import fs from 'fs';
import autoStartContent from '../../resources/autostart.desktop?raw';


const AUTOSTART_DESKTOP_FILE_PATH = `${process.env.HOME}/.config/autostart/cloudmusic.desktop`;

let autoStart: boolean;

function isAutoStartDesktopFileExists() {
    return fs.existsSync(AUTOSTART_DESKTOP_FILE_PATH);
}

function createAutoStartDesktopFile() {
    if (isAutoStartDesktopFileExists()) return true;

    try {
        fs.writeFileSync(AUTOSTART_DESKTOP_FILE_PATH, autoStartContent, 'utf-8');
        return true;
    } catch (error) {
        console.error('Failed to create autostart desktop file:', error);
        return false;
    }
}

function removeAutoStartDesktopFile() {
    if (!isAutoStartDesktopFileExists()) return true;

    try {
        fs.unlinkSync(AUTOSTART_DESKTOP_FILE_PATH);
        return true;
    } catch (error) {
        console.error('Failed to remove autostart desktop file:', error);
        return false;
    }
}

export function setAutoStart(enable: boolean) {
    console.log(`setAutoStart: ${enable}`);

    if (enable && createAutoStartDesktopFile()) autoStart = true;
    if (!enable && removeAutoStartDesktopFile()) autoStart = false;
}

export function isAutoStart() {
    if (autoStart === undefined) {
        autoStart = isAutoStartDesktopFileExists();
    }
    return autoStart;
}
