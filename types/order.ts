import { Position } from './position';  // Assuming it's in a separate file

export type Order = {
    id: number;
    appUserId: number;
    positions: Position[];
    date: string;
}
