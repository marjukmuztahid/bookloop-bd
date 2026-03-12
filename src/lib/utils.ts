import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
