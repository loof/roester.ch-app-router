import NextAuth from 'next-auth'
import { authConfig} from "./auth.config";
export default NextAuth(authConfig).auth;
// MATCHES ALL PATHS EXCEPT THOSE BELOW, note the `|$` at the end, that will also match the base path (index)
export const config = {
    matcher: [
        '/((?!api|images|site.webmanifest|_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|mstile-150x150.png|safari-pinned-tab.svg|version|$).*)',
    ],
};