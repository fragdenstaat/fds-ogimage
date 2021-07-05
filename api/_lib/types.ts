import { URL } from 'url'
import { IncomingMessage } from 'http';


export interface ParsedRequest {
    url: URL;
    path: string;
    hash: string;
}

interface HashQuery {
    hash: string;
}

export interface VercelIncomingMessage extends IncomingMessage {
    query: HashQuery
}
