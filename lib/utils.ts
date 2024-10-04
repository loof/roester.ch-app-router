import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (str: string) => new Intl.DateTimeFormat('de-DE').format(new Date(str));

export function roundToFiveCents(n: number): string {
  return (Math.round(n * 20) / 20).toFixed(2);
}