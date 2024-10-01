import { v4 as uuidv4 } from 'uuid';
import { EventProductAmount } from "@/types/event-product-amount";
import {Tag} from "@/types/tag";
import {Part} from "@/types/part";

export default function Varieties({ eventProductAmount, className }: { eventProductAmount: EventProductAmount, className?: string }) {
    // Extract product for easier reference
    const { product } = eventProductAmount;

    return (
        <>
            {/* Display the 100% Arabica or Robusta message */}
            {product && product.tags.length > 0 && (
                <p>
                    {(!product.madeOf || product.madeOf.length === 0) ? <span className={"capitalize"}>100% {product.tags.find((t : Tag) => t.name === "arabica" || t.name === "robusta")?.name || "Unbekannt"}</span> : ""}
                </p>
            )}

            {/* Display the madeOf details */}
            {product.madeOf && product.madeOf.length > 0 &&
                product.madeOf.map(p => {
                    // Use optional chaining to avoid errors when accessing tags
                    const tagName = p.part?.tags?.find((t : Tag) => t.name === "arabica" || t.name === "robusta")?.name || "Unbekannt";

                    return (
                        <p key={uuidv4()}>
                            {p.amount}% <span className={"capitalize"}>{tagName}</span><br />
                        </p>
                    );
                })
            }
        </>
    );
}
