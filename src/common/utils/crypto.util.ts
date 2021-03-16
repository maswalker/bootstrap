
import crypto from 'crypto';

function md5(key: string) {
    return crypto.createHash('md5').update(key).digest('hex');
}

function hmacSha1(content: string, key: string) {
    return crypto.createHmac('sha1', key).update(content).digest('hex');
}

export { md5, hmacSha1 };
