import { ServerResponse } from 'http';
import { createHash } from 'crypto'

import { VercelIncomingMessage } from './_lib/types';
import { parseRequest } from './_lib/parser';
import { getScreenshot } from './_lib/chromium';
import { getHtml } from './_lib/fetch';


const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1';

export default async function handler(req: VercelIncomingMessage, res: ServerResponse) {
    let parsedReq
    try {
        parsedReq = parseRequest(req);
    } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Bad Request</h1>');
        return;
    }
    try {
        const html = await getHtml(parsedReq);
        if (isHtmlDebug) {
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            return;
        }
        const hash = createHash('sha256');
        hash.update(html);
        const hexDigest = hash.digest('hex');
        if (hexDigest !== parsedReq.hash) {
            res.writeHead(302, {
                Location: `/api/${hexDigest}?path=${encodeURIComponent(parsedReq.path)}`
            });
            res.end();
            return;
        }
        const file = await getScreenshot(html, isDev);
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
