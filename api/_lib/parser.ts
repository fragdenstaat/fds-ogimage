import { IncomingMessage } from 'http';
import { URL } from 'url'
import { ParsedRequest } from './types';

const ORIGIN = 'https://fragdenstaat.de'

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    let reqUrl = new URL(req.url || '/');
    const path = reqUrl.searchParams.get('path');
    const hash = reqUrl.searchParams.get('hash');
    if (!hash) {
        throw new Error('Bad hash')
    }
    if (!path || path[0] !== '/') {
        throw new Error('Bad path');
    }
    let url = new URL(path, ORIGIN);
    if (url.origin !== ORIGIN) {
        throw new Error('Bad path');
    }

    const parsedRequest: ParsedRequest = {
        url, hash
    };
    return parsedRequest;
}
