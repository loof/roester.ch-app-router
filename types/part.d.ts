import {Tag} from "@/types/tag";
import {Variant} from "@/types/variant";
import {SoldUnit} from "@/types/sold-unit";

export type Part = {
    id: number;
    name: string;
    description: string;
    tags: Tag[];
    properties: any[]; // Adjust this based on actual property structure
    madeOf: any[]; // Parts can also have nested parts if required
    variants: Variant[];
    soldUnit: SoldUnit;
};