import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Cart} from "@/types/cart";
import {CartItem} from "@/types/cart-item";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatDate = (str: string) => new Intl.DateTimeFormat('de-DE').format(new Date(str));

export function roundToFiveCents(n: number): number {
    return Number((Math.round(n * 20) / 20).toFixed(2))
}

export function getSubTotalForEventProduct(eventProductAmountId: number, cart: Cart): number {
    if (!eventProductAmountId) return 0;
    let subTotal: number = 0
    cart.items.forEach((item: CartItem) => {
        const stockMultiplier = item.variant?.stockMultiplier || 0;
        if (item.eventProductAmountId === eventProductAmountId) {
            subTotal += (stockMultiplier * item.amount)
        }
    })
    return subTotal
}