import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createMcpServer } from '../src/server.js';
import type { ParsedData } from '@figma-config/core';
// @ts-ignore — esbuild handles JSON imports natively; NodeNext requires 'with' but Edge bundler doesn't support it yet
import rawData from '../data/data.json';

export const config = { runtime: 'edge' };

// Cast from inferred JSON type to our domain type
const data = rawData as unknown as ParsedData;

export default async function handler(req: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  const server = createMcpServer(data);
  await server.connect(transport);
  const response = await transport.handleRequest(req);
  await server.close();
  return response;
}
