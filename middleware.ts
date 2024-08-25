import {initAuth0, withMiddlewareAuthRequired} from "@auth0/nextjs-auth0/edge"
import {NextRequest, NextResponse} from "next/server";
import {handleAuth} from "@auth0/nextjs-auth0";

export default withMiddlewareAuthRequired({
    async returnTo(req) {
        return `${req.nextUrl}`
    },
    // Custom middleware is provided with the `middleware` config option
    async middleware(req) {
        return NextResponse.next();
    }
});
// MATCHES ALL PATHS EXCEPT THOSE BELOW, note the `|$` at the end, that will also match the base path (index)
export const config = {
    matcher: [
        '/((?!api/auth|images|site.webmanifest|_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|mstile-150x150.png|safari-pinned-tab.svg|version|$).*)',
    ],
};