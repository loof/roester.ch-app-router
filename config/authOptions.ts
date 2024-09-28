import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/lib/api/auth";
import { UserType } from "@/types/user"; // Ensure UserType is correctly defined
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Ensure credentials are provided
                if (!credentials) return null;

                // Type assertion to safely access email and password
                const email = credentials.email as string | undefined;
                const password = credentials.password as string | undefined;

                // Check if email and password are defined
                if (!email || !password) return null;

                // Call the login function, which should return a user object
                const user = await login({ email, password }) as UserType; // Cast the return type

                // Check if login was successful (this should depend on your API)
                if (!user) return null;

                // Return the user object with required properties
                return {
                    email: user.email,
                    accessToken: user.accessToken,
                    userId: user.userId,
                    cartId: user.cartId,
                    // Add any other required properties from your user object
                };
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
};
