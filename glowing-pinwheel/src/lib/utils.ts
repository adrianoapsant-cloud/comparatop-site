import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for optimal className handling.
 * Allows conditional classes and proper Tailwind class merging.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
