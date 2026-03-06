import { app, net, protocol, session, OnCompletedListenerDetails } from "electron";
import fs from "fs-extra";
import path from "path";
import mime from "mime";


const VALID_RESOURCE_HOSTNAMES = [
    'music.163.com',
    'music.126.net'
];
const VALID_RESOURCE_TYPE = [
    // 'stylesheet',
    'script',
    // 'image',
    // 'font'
];

function needSaveResource(details: OnCompletedListenerDetails): boolean {
    const { url, method, statusCode, resourceType } = details;
    const urlObj = new URL(url);

    if (urlObj.protocol !== 'https:' || method !== 'GET' || statusCode !== 200) return false;
    if (!VALID_RESOURCE_HOSTNAMES.some(hostname => urlObj.hostname.endsWith(hostname))) return false;
    if (!VALID_RESOURCE_TYPE.includes(resourceType)) return false;

    return true;
}

function getSafeLocalPath(basepath: string, hostname: string, pathname: string): string | null {
    const targetRoot = path.join(basepath, 'local-resources');
    const fullPath = path.join(targetRoot, hostname, pathname);

    const relative = path.relative(targetRoot, fullPath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        return null;
    }
    return fullPath;
}

async function saveResource(url: URL) {
    const localPath = getSafeLocalPath(app.getAppPath(), url.hostname, url.pathname);
    if (!localPath) {
        console.warn(`Blocked unsafe path attempt: ${url.pathname}`);
        return;
    }

    try {
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());

        await fs.ensureDir(path.dirname(localPath));
        await fs.writeFile(localPath, buffer);
    } catch (err) {
        console.error(`Failed to save resource: ${url}`, err.message);
    }
}

export function handleSaveResources() {
    session.defaultSession.webRequest.onCompleted(async (details) => {
        if (!needSaveResource(details)) return;

        const urlObj = new URL(details.url);
        await saveResource(urlObj);
    });
}

export function handleHttpRequest() {
    // https://github.com/electron/electron/issues/42244
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const responseHeaders = details.responseHeaders;

        for (const [key, value] of Object.entries(responseHeaders)) {
            // normalize and convert all non-ASCII characters to ASCII using Buffer
            responseHeaders[key] = value.map((entry) => {
                const normalized = entry.normalize("NFKD");
                const buffer = Buffer.from(normalized, "utf8");
                return buffer.toString("ascii");
            });
        }

        callback({ responseHeaders });
    });

    protocol.handle('https', async (request) => {
        const url = new URL(request.url);

        if (request.method === 'GET') {
            const basePath = process.env.NODE_ENV === 'development' ? app.getAppPath() : process.resourcesPath;
            const localPath = getSafeLocalPath(basePath, url.hostname, url.pathname);

            if (localPath && fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
                const buffer = await fs.promises.readFile(localPath);
                return new Response(buffer, {
                    headers: {
                        'Content-Type': mime.getType(localPath) || 'application/octet-stream',
                    }
                });
            }
        }

        return await net.fetch(request, { bypassCustomProtocolHandlers: true });
    });
}
