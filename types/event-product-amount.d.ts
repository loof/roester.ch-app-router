import {Product} from "@/types/product";

export type EventProductAmount = {
    id: number;
    eventId: number;
    productId: number | null;
    amountLeft: number;
    amountTotal: number;
    product: Product;
};