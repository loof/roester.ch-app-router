import { atom } from 'jotai'
import {Cart} from "@/types/cart";
import {Variant} from "@/types/variant";
import {EventProductAmount} from "@/types/event-product-amount";

export const variantsAtom = atom<Map<number, Variant>>(new Map<number, Variant>())