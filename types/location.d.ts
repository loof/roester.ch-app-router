export type Location = {
    id: number | null;
    street: string;
    streetNumber: string;
    city: string;
    postalCode: string;
    longitude?: number | null;
    latitude?: number | null;
    eventIds?: number[] | null;
};