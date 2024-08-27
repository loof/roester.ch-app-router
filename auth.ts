import NextAuth from 'next-auth';
import {authConfig} from "./auth.config";
import Credentials from 'next-auth/providers/credentials'
import {z} from 'zod';
import {login} from "@/lib/api/auth";

export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({email: z.string().email(), password: z.string().min(8)})
                .safeParse(credentials);

            if (parsedCredentials.success) {
                const {email, password} = parsedCredentials.data;
                return await login({email, password});
            }

            return null
        }
    })]
});