import getPem from 'rsa-pem-from-mod-exp';
import crypto from 'crypto';


const MODULUS = 'e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
const PUB_KEY = '010001';

const eBase64 = Buffer.from(PUB_KEY, 'hex').toString('base64');
const nBase64 = Buffer.from(MODULUS, 'hex').toString('base64');

const pemPublicKey = getPem(nBase64, eBase64);
console.log(pemPublicKey);

const message = Buffer.from('Hello World');

// Error: error:0200007A:rsa routines::data too small for key size
const paddedMessage = Buffer.concat([Buffer.alloc(128 - message.length, 0), message]);

const encrypted = crypto.publicEncrypt(
    { key: pemPublicKey, padding: crypto.constants.RSA_NO_PADDING },
    paddedMessage
).toString('hex');

console.log('Encrypted message:', encrypted);
