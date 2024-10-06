import {DisplayUnit} from "@/types/display-unit";

export type Variant = {
    id: number;
    name: string;
    description: string | null;
    productId: number | null;
    displayUnit: DisplayUnit;
    price: number | null;
    productName: string | null;
    stockMultiplier: number;
};