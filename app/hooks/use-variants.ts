import {Variant} from "@/types/variant";
import {Roast} from "@/types/roast";
import {useEffect, useState} from "react";
import {Product} from "@/types/product";

export default function useVariantMap(roast : Roast) {


    useEffect(() => {
        if (!roast) return;

    }, [roast]);

    const [variantMap, setVariantMap]  = useState(new Map());

    roast.eventProductAmounts.forEach(productAmount => {
        const product: Product = productAmount.product;

        // Check if the product has variants
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                // Store variant in the Map using its id as the key
                if (!variantMap.has(variant.id)) {
                    variantMap.set(variant.id, variant);
                }
            });
        }

    });

    return {
        variantMap
    }

}