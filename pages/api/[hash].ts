import type { NextApiRequest, NextApiResponse } from 'next';

import { Renderer } from './_lib/chromium';
import { parseRequest } from './_lib/parser';


const isDev = process.env.NODE_ENV !== "production";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let parsedReq
    try {
        parsedReq = parseRequest(req);
    } catch (e) {
        console.warn(e)
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Bad Request</h1>');
        return;
    }
    const renderer = new Renderer();
    await renderer.init(isDev);
    let changedHexDigest
    try {
        changedHexDigest = await renderer.checkChangedHash(parsedReq);
    } catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Not Found</h1>');
        return;
    }
    if (changedHexDigest !== null) {
        res.writeHead(302, {
            Location: `/api/${changedHexDigest}?path=${encodeURIComponent(parsedReq.path)}`
        });
        res.end();
        return;
    }
    try {
        const file = await renderer.getScreenshot();
        res.statusCode = 200;
        res.setHeader('Content-Type', `image/png`);
        res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`);
        res.end(file);
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>');
        console.error(e);
    }
}
