import CredentialsProvider from "next-auth/providers/credentials";
import {login} from "@/lib/api/auth";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                // Add logic to verify credentials here
                if (!credentials) return null
                const {email, password} = credentials
                const user = await login({email, password})
                // Fetch user and password hash from your database
                // Example: const user = await getUserByEmail(email)
                return {email: user.email}
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 1 * 24 * 60 * 60, // 1 day
    },
    jwt: {
        // JWT encoding and decoding configurations
    },
    callbacks: {
        // signIn, session callbacks
    },
    pages: {
        signIn: '/login', // Custom sign-in page
    },
}