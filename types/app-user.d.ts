import {Location} from "@/types/location";

export type AppUser = {
    id: number | null;
    companyName?: string | null;
    firstname: string;
    lastname: string;
    email: string;
    location: Location
    password: string;
}