import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log(pathname);

    if (pathname.startsWith('/api/v1/user/register')) {
        console.log('############ REGISTER HANDLER');
        // do something that does not require auth
        return NextResponse.next();
    } else
    if (pathname.startsWith('/api/v1')) {
        console.log('############ API HANDLER');
        withMiddlewareAuthRequired(async function middleware(req) {
            const res = NextResponse.next();
            const { accessToken } = await getAccessToken(req, res);
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('Authorization', `Bearer ${accessToken as string}`);
            const url = `rest api endpoint`;
            return NextResponse.rewrite(new URL(url), {
                request: {
                    headers: requestHeaders,
                },
            });
        });
    } else if (pathname.startsWith('/api/graphql')) {
        console.log('############ GQL HANDLER');
        withMiddlewareAuthRequired(async function middleware(req) {
            const res = NextResponse.next();
            const { accessToken } = await getAccessToken(req, res);
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('Authorization', `Bearer ${accessToken as string}`);
            const url = `graphql api endpoint`;
            return NextResponse.rewrite(url, {
                request: {
                    headers: requestHeaders,
                },
            });
        });
    } else {
        console.log('############ EVERYTHING ELSE HANDLER');
        withMiddlewareAuthRequired();
        return NextResponse.next();
    }
}
// MATCHES ALL PATHS EXCEPT THOSE BELOW, note the `|$` at the end, that will also match the base path (index)
export const config = {
    matcher: [
        '/((?!api/auth|images|site.webmanifest|_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|mstile-150x150.png|safari-pinned-tab.svg|version|$).*)',
    ],
};