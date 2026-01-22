import { differenceInDays, isAfter, isBefore, parseISO } from "date-fns";
import { WarrantyStatus } from "./types";

export function getWarrantyStatus(endDate: string): WarrantyStatus {
  const today = new Date();
  const warranty = parseISO(endDate);
  const daysRemaining = differenceInDays(warranty, today);

  if (daysRemaining < 0) {
    return {
      status: "expired",
      daysRemaining: 0,
      color: "red"
    };
  } else if (daysRemaining <= 90) {
    return {
      status: "expiring_soon",
      daysRemaining,
      color: daysRemaining <= 30 ? "red" : "amber"
    };
  } else {
    return {
      status: "active",
      daysRemaining,
      color: "green"
    };
  }
}

export function isExpiringSoon(endDate: string, days: number = 90): boolean {
  const today = new Date();
  const expiry = parseISO(endDate);
  const daysRemaining = differenceInDays(expiry, today);
  return daysRemaining > 0 && daysRemaining <= days;
}

export function isExpired(endDate: string): boolean {
  const today = new Date();
  const expiry = parseISO(endDate);
  return isBefore(expiry, today);
}

export function daysUntilExpiry(endDate: string): number {
  const today = new Date();
  const expiry = parseISO(endDate);
  return Math.max(0, differenceInDays(expiry, today));
}
