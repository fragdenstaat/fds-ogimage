import { URL } from 'url'
import { ParsedRequest, VercelIncomingMessage } from './types';

const ORIGIN = process.env.ORIGIN_URL

const ALLOWED_PATHS = /^\/(profil|en\/profile|anfrage|en\/request)\/[\w+\.-]+\/_og\/$/

export function parseRequest(req: VercelIncomingMessage) {
    console.log('HTTP ' + req.url);
    let reqUrl = new URL(req.url || '/', `https://${req.headers.host}`);
    const path = reqUrl.searchParams.get('path');
    const hash = req.query.hash
    if (!hash) {
        throw new Error('Bad hash')
    }
    if (!path || path[0] !== '/') {
        throw new Error('Bad path');
    }
    if (ALLOWED_PATHS.exec(path) === null) {
        throw new Error('Bad path');
    }
    let url = new URL(path, ORIGIN);
    if (url.origin !== ORIGIN) {
        throw new Error('Bad path');
    }

    const parsedRequest: ParsedRequest = {
        url, hash, path
    };
    return parsedRequest;
}
