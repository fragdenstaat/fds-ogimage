import fetch from "node-fetch";

import { ParsedRequest } from './types';

export async function getHtml(parsedReq: ParsedRequest) {
  const response = await fetch(parsedReq.url)
  if (!response.ok) {
    console.error('fetch error for URL', parsedReq.url)
    console.error('fetch response', response.status)
    throw new Error('Could not get html')
  }
  return await response.text()
}