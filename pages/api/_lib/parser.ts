import { URL } from 'url'
import type { NextApiRequest } from 'next'

import { ParsedRequest } from './types';

const ORIGIN = process.env.ORIGIN_URL

const ALLOWED_PATHS = process.env.ALLOWED_PATHS.split(",")
const PATH_REGEX = new RegExp(`^/(${ALLOWED_PATHS.join("|")})/_og/$`)

export function parseRequest(req: NextApiRequest) {
    console.log('HTTP ' + req.url);
    let reqUrl = new URL(req.url || '/', `https://${req.headers.host}`);
    const path = reqUrl.searchParams.get('path');
    let hash = req.query.hash
    if (!hash) {
        throw new Error('Bad hash')
    }
    if (Array.isArray(hash)) {
        hash = hash[0]
    }
    if (!path || path[0] !== '/') {
        throw new Error('Bad path');
    }
    if (PATH_REGEX.exec(path) === null) {
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
