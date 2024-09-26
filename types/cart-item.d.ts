import {Variant} from "@/types/variant";

export type CartItem = {
    id: number;
    eventId: number;
    variantId: number;
    amount: number;
    variant: Variant;
}