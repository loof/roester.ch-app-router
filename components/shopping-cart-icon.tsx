"use client"

import { ShoppingCart } from "lucide-react"
import {cartAtom} from "@/app/atoms/shopping-cart-atom";
import {useEffect} from "react";
import {useAtom} from 'jotai'



export default function ShoppingCartIcon({ itemCount = 0 }: { itemCount?: number }) {
    const [numberOfItems, setNumberOfItems] = useAtom(cartAtom)

    useEffect(() => {
        setNumberOfItems(itemCount)
    }, [itemCount]);

    return (
        <div className="relative inline-block">
            <button
                className="p-2 focus:outline-none rounded-full"
                aria-label={`Shopping cart with ${itemCount} items`}
            >
                <ShoppingCart className="h-6 w-6" />
            </button>
            {numberOfItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
          {numberOfItems}
        </span>
            )}
        </div>
    )
}