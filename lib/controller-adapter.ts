import { NextRequest, NextResponse } from 'next/server';
import type { Request, Response } from 'express';

/**
 * Adapter to use existing Express controllers with Next.js API routes
 */
export function createControllerAdapter(
  controller: (req: Request, res: Response) => Promise<void> | void
) {
  return async (req: NextRequest, context?: any) => {
    try {
      // Create Express-like request object
      const expressReq = {
        ...req,
        params: context?.params || {},
        query: Object.fromEntries(new URL(req.url).searchParams),
        body: req.method !== 'GET' ? await req.json().catch(() => ({})) : {},
        // Add user if available in headers (assuming Firebase Auth)
        user: req.headers.get('x-user-id') 
          ? { uid: req.headers.get('x-user-id') } 
          : undefined
      } as unknown as Request;

      // Create Express-like response object with capture mechanism
      let statusCode = 200;
      let responseBody: any = null;
      let responseHeaders: Record<string, string> = {};

      const expressRes = {
        status: (code: number) => {
          statusCode = code;
          return expressRes;
        },
        json: (body: any) => {
          responseBody = body;
          return expressRes;
        },
        setHeader: (name: string, value: string) => {
          responseHeaders[name] = value;
          return expressRes;
        },
        end: () => {
          // No action needed here for our adapter
          return expressRes;
        }
      } as unknown as Response;

      // Call the controller (it might return a Promise or void)
      const result = controller(expressReq, expressRes);
      
      // If it returns a Promise, await it
      if (result instanceof Promise) {
        await result;
      }

      // Some controllers might not set a response body
      if (responseBody === null) {
        responseBody = { message: 'OK' };
      }

      // Return NextResponse
      return NextResponse.json(responseBody, {
        status: statusCode,
        headers: responseHeaders
      });
    } catch (error: any) {
      console.error('Controller adapter error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message },
        { status: 500 }
      );
    }
  };
} 