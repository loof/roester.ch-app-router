import {AppUser} from "@/types/app-user";

const URL = process.env.NEXT_PUBLIC_BASE_URL

export async function login({ email, password } : {email: string, password: string}) {
    const response = await fetch(`${URL}/auth/signin`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}

export async function signup(appUser: AppUser): Promise<AppUser> {
    const res = await fetch(`${URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({appUser, type: "credentials"}),
    });

    if (!res.ok) {
        throw new Error("An error occured while fetching")
    }


    const data = await res.json()
    return data
}