export type Location = {
    id: number;
    street: string;
    streetNr: string;
    city: string;
    postalCode: number;
    longitude: number | null;
    latitude: number | null;
    eventIds: number[];
};