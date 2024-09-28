import { atom } from 'jotai'
import {Cart} from "@/types/cart";

export const cartAtom = atom<Cart>({
    id: 0,
    items: [],
    userId: 0,
    total: 0
})