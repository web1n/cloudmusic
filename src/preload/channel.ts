import { Channel } from "src/cloudmusic";


export function initChannel() {
    const channel: Channel = {
        call: (command: string, _callback: any, params: any[]) => {
            console.log(`channel.call: ${command}:`, params);
        },
        registerCall: (command: string, _callback: any) => {
            console.log(`channel.registerCall: ${command}`);
        },
        viewCall: (...params: any) => {
            console.log('channel.viewCall:', params);
        }
    };

    const channelHandler = {
        get: (target: any, prop: any) => {
            if (prop in target) return target[prop];

            console.warn(`Missing API: window.channel.${prop} is not defined`);
            return undefined;
        }
    };

    // Uncaught TypeError: Cannot assign to read only property 'registerCall' of object '#<Object>'
    // contextBridge.exposeInMainWorld('channel', channel);
    window.channel = new Proxy(channel, channelHandler);
}
