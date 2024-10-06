import {CartItem} from "@/types/cart-item";
import {Variant} from "@/types/variant";

export type Cart = {
    id: number;
    items: CartItem[];
    userId: number;
    total: number;
}
