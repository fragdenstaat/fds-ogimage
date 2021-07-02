import fetch from "node-fetch";

import { ParsedRequest } from './types';

export async function getHtml(parsedReq: ParsedRequest) {
  const response = await fetch(parsedReq.url)
  return await response.text()
}