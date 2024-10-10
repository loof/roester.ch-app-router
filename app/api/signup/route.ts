// library imports
import { NextResponse, NextRequest } from "next/server";

// internal imports
import { signIn } from "@/auth";
import {createAppUser} from "@/lib/api/app-user";
import {AppUser} from "@/types/app-user";

const URL = process.env.NEXT_PUBLIC_BASE_URL

export async function POST(req: NextRequest, res: NextResponse) {

    const appUser : AppUser = await req.json();

    const body = JSON.stringify(appUser)

    console.log(body)

    try {
        const registerResponse = await fetch(`${URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });

        if (!registerResponse || !registerResponse.ok) {
            return NextResponse.json({ error: "Something went wrong" });
        } else {

            const result =  await signIn("credentials", { redirect: false, email: appUser.email, password: appUser.password });

            // handle the result of the sign-in attempt
            if (!result || result.error) {
                return NextResponse.json({ error: "Something went wrong" });
            } else {
                return NextResponse.json({ success: true });
            }

        }

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" });
    }




}