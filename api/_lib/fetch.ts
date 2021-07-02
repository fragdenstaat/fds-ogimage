import fetch from "node-fetch";

import { ParsedRequest } from './types';

export async function getHtml(parsedReq: ParsedRequest) {
  const response = await fetch(parsedReq.url)
  if (!response.ok) {
    throw new Error('Could not get html')
  }
  return await response.text()
}