import {Variant} from "@/types/variant";
import {Roast} from "@/types/roast";
import {useEffect, useState} from "react";
import {Product} from "@/types/product";
import {EventProductAmount} from "@/types/event-product-amount";
import {useAtom} from "jotai";
import {eventProductAmountsAtom} from "@/app/atoms/event-product-amounts-atom";
import {variantsAtom} from "@/app/atoms/variants-atom";
import {productsAtom} from "@/app/atoms/products-atom";


export default function useEventCache(roast : Roast) {


    useEffect(() => {
        if (!roast) return;
    }, [roast]);

    const [variantMap, setVariantMap]  = useAtom(variantsAtom);
    const [eventProductAmountMap, setEventProductAmountMap]  = useAtom(eventProductAmountsAtom);
    const [productMap, setProductMap] = useAtom(productsAtom)

    roast.eventProductAmounts.forEach(eventProductAmount => {

        const product: Product = eventProductAmount.product;

        if (!eventProductAmountMap.has(eventProductAmount.id)) {
            eventProductAmountMap.set(eventProductAmount.id, eventProductAmount);
        }
        if (eventProductAmount.productId && !productMap.has(eventProductAmount.productId)) {
            productMap.set(eventProductAmount.productId, product);
        }

        // Check if the product has variants
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                // Store variant in the Map using its id as the key
                if (!variantMap.has(variant.id)) {
                    variantMap.set(variant.id, variant);
                }
            });
        }
    })

    return {
        variantMap,
        eventProductAmountMap,
        productMap,
    }

}