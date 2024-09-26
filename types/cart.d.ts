import {CartItem} from "@/types/cart-item";

export type Cart = {
    id: number;
    items: CartItem[];
    userId: number;
    total: number;
}