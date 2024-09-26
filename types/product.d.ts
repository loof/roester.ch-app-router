import {Tag} from "@/types/tag";
import {MadeOf} from "@/types/made-of";
import {Variant} from "@/types/variant";
import {SoldUnit} from "@/types/sold-unit";

export type Product = {
    id: number;
    name: string;
    description: string;
    tags: Tag[];
    properties: any[]; // Adjust this based on actual property structure
    madeOf: MadeOf[]; // Product components
    variants: Variant[];
    soldUnit: SoldUnit;
};