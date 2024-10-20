import {Location} from "@/types/location";

export type AppUserLight = {
    id: number | null;
    companyName?: string | null;
    firstname: string;
    lastname: string;
    location: Location
}