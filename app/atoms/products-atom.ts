import { atom } from 'jotai'
import {Product} from "@/types/product";

export const productsAtom = atom<Map<number, Product>>(new Map<number, Product>())