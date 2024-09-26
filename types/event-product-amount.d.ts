import {Product} from "@/types/product";

export type EventProductAmount = {
    id: number;
    event_id: number;
    product_id: number | null;
    amountLeft: number;
    amountTotal: number;
    product: Product;
};