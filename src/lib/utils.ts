import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Platform fee rate applied to every listing (flat 10%).
 */
export const PLATFORM_FEE_RATE = 0.10;

/**
 * Calculate the platform fee based on the seller's price.
 * Flat 10% across all price ranges.
 */
export function calculatePlatformFee(sellerPrice: number): number {
  return Math.round(sellerPrice * PLATFORM_FEE_RATE);
}

/**
 * Calculate the buyer-facing display price (seller price + platform fee).
 */
export function calculateDisplayPrice(sellerPrice: number): number {
  return sellerPrice + calculatePlatformFee(sellerPrice);
}

/**
 * Calculate the seller payout (seller price minus platform fee).
 * Seller receives their original price; fee is baked into buyer price.
 * Payout = sellerPrice (seller gets what they asked for).
 */
export function calculateSellerPayout(sellerPrice: number): number {
  return sellerPrice;
}

export function calculateDeliveryCharge(
  weightKg: number,
  sellerDistrict: string,
  buyerDistrict: string
): number {
  const isDhakaToDhaka =
    sellerDistrict.toLowerCase() === 'dhaka' &&
    buyerDistrict.toLowerCase() === 'dhaka';

  if (weightKg < 2) return isDhakaToDhaka ? 90 : 120;
  if (weightKg < 4) return isDhakaToDhaka ? 110 : 150;
  return isDhakaToDhaka ? 150 : 170;
}
