

export type AppUser = {
    id: number | null;
    companyName?: string | null;
    firstname: string;
    lastname: string;
    email: string;
    street: string;
    streetNumber: string; // maybe some streets have letters in their streetNr eg. 4a, therefore string
    city: string;
    postalCode: string; // same reason for string as street number
    password: string;
}