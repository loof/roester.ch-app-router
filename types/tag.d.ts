export type Tag = {
    id: number;
    name: string;
    productIds: number[] | null; // productIds can be null
};