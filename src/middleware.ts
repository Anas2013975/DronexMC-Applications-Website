import { NextRequest, NextResponse } from 'next/server';
// Admin APIs perform signed-cookie verification individually; middleware intentionally does not
// replace those checks. This file exists to reserve a place for future route-level policies.
export function middleware(_req: NextRequest) { return NextResponse.next(); }
export const config = { matcher: ['/admin/:path*'] };
