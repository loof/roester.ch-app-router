import {Variant} from "@/types/variant";
import {Roast} from "@/types/roast";
import {useEffect, useState} from "react";
import {Product} from "@/types/product";
import {EventProductAmount} from "@/types/event-product-amount";

export default function useEventCache(roast : Roast) {


    useEffect(() => {
        if (!roast) return;

    }, [roast]);

    const [variantMap, setVariantMap]  = useState(new Map<number, Variant>());
    const [eventProductAmountMap, setEventProductAmountMap]  = useState(new Map<number, EventProductAmount>());
    const [productMap, setProductMap] = useState(new Map<number, Product>)

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