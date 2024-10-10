import { AppUser } from "@/types/app-user";

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
    companyName?: string | null  // Optional
): AppUser {
    return {
        id,
        companyName: companyName || null, // Defaults to null if not provided
        firstname,
        lastname,
        street,
        streetNumber,
        city,
        postalCode,
        email,
        password,
    };
}
