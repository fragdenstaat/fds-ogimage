import { URL } from 'url'


export interface ParsedRequest {
    url: URL;
    path: string;
    hash: string;
}

