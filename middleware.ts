import {NextRequest, NextResponse} from "next/server";

export default function middleware(request: NextRequest) {
    // Custom middleware is provided with the `middleware` config option
    return NextResponse.next();
}
// MATCHES ALL PATHS EXCEPT THOSE BELOW, note the `|$` at the end, that will also match the base path (index)
export const config = {
    matcher: [
        '/((?!api/auth|login|signup|images|site.webmanifest|_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|mstile-150x150.png|safari-pinned-tab.svg|version|$).*)',
    ],
};