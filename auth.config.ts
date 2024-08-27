import type { NextAuthConfig} from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        authorized({ auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            const isOnHome = nextUrl.pathname.startsWith('/')
            if (isOnHome) {
                return isLoggedIn;
            } else if (isLoggedIn) {
                console.log("logged in")
                return Response.redirect(new URL('/', nextUrl))
            }
            return true;
        }
    },
    providers: []
} satisfies NextAuthConfig;