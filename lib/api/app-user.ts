import { AppUser } from "@/types/app-user";
import { Location } from "@/types/location";

const URL = process.env.NEXT_PUBLIC_BASE_URL

export function createAppUser(
    firstname: string,
    lastname: string,
    street: string,
    streetNumber: string,
    city: string,
    postalCode: string,
    email: string,
    password: string,
    id: number | null = null,  // Optional with default value as null
    companyName?: string | null,  // Optional
    longitude: number | null = null,  // Optional with default null
    latitude: number | null = null,  // Optional with default null
    eventIds: number[] = []  // Default empty array for event IDs
): AppUser {
    const location: Location = {
        id: null,
        street,
        streetNumber,
        city,
        postalCode: parseInt(postalCode),  // postalCode should be a number
        longitude,
        latitude,
        eventIds,
    };

    return {
        id,
        companyName: companyName || null, // Defaults to null if not provided
        firstname,
        lastname,
        email,
        password,
        location,  // Assign the full location object here
    };
}


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
