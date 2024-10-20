import {AppUserLight} from "@/types/app-user-light";

const URL = process.env.NEXT_PUBLIC_BASE_URL

export async function getAppUserById(token: string, userId: number) {
    const response = await fetch(`${URL}/users/${userId}`, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching")
    }

    const data = await response.json()

    return data
}

export async function updateAppUser(token: string, id: number, appUser: AppUserLight) {
    const response = await fetch(`${URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(appUser)
    })

    if (!response.ok) {
        throw new Error("An error occurred while updating the variant")
    }

    return await response.json()
}
