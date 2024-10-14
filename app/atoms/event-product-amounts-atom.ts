import { atom } from 'jotai'
import {EventProductAmount} from "@/types/event-product-amount";
import {Cart} from "@/types/cart";

export const eventProductAmountsAtom = atom<Map<number, EventProductAmount>>(new Map<number, EventProductAmount>())