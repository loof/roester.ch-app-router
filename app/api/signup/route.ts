// library imports
import { NextResponse, NextRequest } from "next/server";

// internal imports
import { signIn } from "@/auth";
import {createAppUser} from "@/lib/api/app-user";
import {AppUser} from "@/types/app-user";

const URL = process.env.NEXT_PUBLIC_BASE_URL

export async function POST(req: NextRequest, res: NextResponse) {
    const appUser: AppUser = await req.json();
    const body = JSON.stringify(appUser);

    try {
        const registerResponse = await fetch(`${URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });

        if (registerResponse.status === 409) {
            return NextResponse.json({ error: "E-Mail Adresse existiert bereits" }, { status: 409 });
        } else if (!registerResponse.ok) {
            return NextResponse.error()
        } else {
            // Proceed to sign-in if registration is successful
            const result = await signIn("credentials", {
                redirect: false,
                email: appUser.email,
                password: appUser.password,
            });

            // Handle the result of the sign-in attempt
            if (!result || result.error) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }

            return NextResponse.json({ success: true }, { status: 200 });
        }
    } catch (error) {
        // Return a 500 Internal Server Error in case of an exception
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
