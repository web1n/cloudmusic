import { net } from 'electron';
import { constants, createCipheriv, publicEncrypt, randomBytes, RsaPublicKey } from 'crypto';
import type { QrCodeLoginStatus } from '../cloudmusic';


const UNIKEY_URL = 'https://music.163.com/weapi/login/qrcode/unikey';
const CHECK_QR_STATUS_URL = 'https://music.163.com/weapi/login/qrcode/client/login';
const USER_PROFILE_URL = 'https://music.163.com/api/user/current/profile';

const AES_IV = Buffer.from('0102030405060708');
const AES_NONCE = Buffer.from('0CoJUm6Qyw8W8jud');

const RSA_PUBLIC_KEY = `
-----BEGIN RSA PUBLIC KEY-----
MIGJAoGBAOC1CfYlnfhkLbw1ZikBR33yJnfsFStf9orOYVu3tyUVKzqxeodq6opa
p20uQXYp7E7jQfVhNfzPaVKAEE4DEuy9qSVXyThwEUr2ydBcT38MNoW3pGvuJVky
V1zOELQk2BPP5IddPoIEe5fd71J0HVRrjiidxpNbPs4EYtsKIrjnAgMBAAE=
-----END RSA PUBLIC KEY-----
`

function aesEncrypt(text: string, key: string | Buffer): string {
    const cipher = createCipheriv(
        'aes-128-cbc',
        typeof key === 'string' ? Buffer.from(key) : key,
        AES_IV
    );

    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encrypted;
}

function generateParams(data: any, secKey: string) {
    const text = JSON.stringify(data);

    const step1 = aesEncrypt(text, AES_NONCE);
    const params = aesEncrypt(step1, secKey);

    return params;
}

function generateEncSecKey(secKey: string): string {
    const message = Buffer.from(secKey, 'utf8').reverse();

    const publicKey: RsaPublicKey = {
        key: RSA_PUBLIC_KEY,
        padding: constants.RSA_NO_PADDING,
    };

    // Error: error:0200007A:rsa routines::data too small for key size
    const paddedMessage = Buffer.concat([Buffer.alloc(128 - message.length, 0), message]);

    return publicEncrypt(publicKey, paddedMessage).toString('hex');
}

async function fetch<T>(url: string, options: {
    method: 'GET' | 'POST';
    params?: {};
    headers?: Record<string, string>;
}): Promise<{
    headers: Headers;
    json: T;
}> {
    const secKey = randomBytes(8).toString('hex');

    const body = options.params
        ? new URLSearchParams({
            params: generateParams(options.params, secKey),
            encSecKey: generateEncSecKey(secKey),
        }).toString()
        : undefined;

    const response = await net.fetch(url, {
        method: options.method,
        body,
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://music.163.com',
            'Referer': 'https://music.163.com/',
            'x-os': 'web',
            'Nm-GCore-Status': '1',
            ...(options.headers || {}),
        }
    });
    if (!response.ok) throw new Error(`Failed to fetch api, status: ${response.status}`);

    const text = await response.text();
    if (!text) throw new Error('Empty response body');

    return {
        headers: response.headers,
        json: JSON.parse(text),
    };
}

export async function generateUnikey(): Promise<{ unikey: string; url: string }> {
    const { json } = await fetch<{ code: number; unikey: string }>(UNIKEY_URL, {
        method: 'POST',
        params: {
            type: 1,
            noCheckToken: true,
        },
    });

    if (json.code !== 200) throw new Error(`Failed to get unikey, response code: ${json.code}`);
    if (typeof json.unikey !== 'string') throw new Error('Unikey not found in response');

    const url = `https://music.163.com/login?codekey=${json.unikey}`;
    return { unikey: json.unikey, url: url };
}

export async function checkQrCodeStatus(unikey: string): Promise<{
    status: QrCodeLoginStatus;
    message?: string;
}> {
    const { headers, json } = await fetch<{
        code: number; message: string;
    }>(CHECK_QR_STATUS_URL, {
        method: 'POST',
        params: {
            type: 1,
            noCheckToken: true,
            key: unikey,
        },
        headers: {
            'X-loginMethod': 'QrCode'
        }
    });
    console.log('Received response for check login status:', json, headers.getSetCookie());

    switch (json.code) {
        case 800:
            return { status: 'expired' };
        case 801: // Not scanned
            return { status: 'waiting' };
        case 802: // Scanned but not confirmed
            return { status: 'scanned' };
        case 803: // Authorized
            return { status: 'authorized' };
        default:
            return { status: 'failed', message: `Unexpected response code: ${json.code} ${JSON.stringify(json)}` };
    }
}

export async function getUserProfile(): Promise<{
    userId: string;
    nickname: string;
    avatarUrl: string;
}> {
    const { json } = await fetch<{
        code: number;
        profile?: { userId: string; nickname: string; avatarUrl: string; }
    }>(USER_PROFILE_URL, {
        method: 'GET'
    });

    if (json.code === 404) throw new Error('User not logged in');
    if (json.code !== 200) throw new Error(`Failed to get user info, response code: ${json.code}`);
    if (!json.profile) throw new Error('User info not found in response');

    return json.profile;
}
