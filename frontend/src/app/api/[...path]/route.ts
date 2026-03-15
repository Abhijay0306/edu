import { NextRequest, NextResponse } from 'next/server';

// Runtime proxy: forwards all /api/* requests to the Express backend
// Runs at request-time, so BACKEND_URL is always fresh
const BACKEND = process.env.BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:5000';

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const targetUrl = `${BACKEND}/api/${path}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    // Don't forward host header - let fetch set it for the target
    if (!['host', 'connection'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined;

  const backendRes = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: body ? Buffer.from(body) : undefined,
    redirect: 'follow',
  });

  const resBody = await backendRes.arrayBuffer();
  const resHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      resHeaders.set(key, value);
    }
  });

  return new NextResponse(resBody, {
    status: backendRes.status,
    headers: resHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const PATCH = handler;
