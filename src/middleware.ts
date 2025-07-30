import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const timestamp = new Date().toISOString();
    const method = request.method;
    const url = request.url;

    console.log(`🚀 [${timestamp}] App is running - Received ${method} request to ${url}`);

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}; 