import {EventProductAmount} from "@/types/event-product-amount";

export type Roast = {
    id: number;
    name: string;
    description: string;
    locationId: number | null;
    date: string; // Can be Date if parsed
    daysBeforeSubscriptionCloses: number;
    location: Location;
    eventProductAmounts: EventProductAmount[];
    amountLeft: number;
    isReservationOpen: boolean;
    daysToEvent: number;
    nextDate: string | null; // Can be Date if parsed
    prevDate: string | null; // Can be Date if parsed
    isNext: boolean | null;
    isPrev: boolean | null;
};