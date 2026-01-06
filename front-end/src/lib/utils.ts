import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateRecommendedAPY(riskGrade: string): number {
  const baseRate = 5;
  const riskPremium: Record<string, number> = {
    "A+": 2, "A": 3, "B": 5, "C": 8, "D": 15
  };
  return (baseRate + (riskPremium[riskGrade] || 10)) * 100;
};

export function formatUSDC(raw: bigint | number | string): string {
  const value = Number(raw) / 1_000_000;

  if (!Number.isFinite(value)) return "0 USDC";

  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value) + " USDC"
  );
}

export function ipfsToHttp(ipfsUrl: string) {
  if (!ipfsUrl.startsWith("ipfs://")) return ipfsUrl;
  const cid = ipfsUrl.replace("ipfs://", "");
  return `https://ipfs.io/ipfs/${cid}`;
}

export function apyFromGrade(grade?: string): number {
  switch ((grade ?? "").trim().toUpperCase()) {
    case "A":
      return 10;
    case "B":
      return 12;
    case "C":
      return 15;
    case "D":
      return 18;
    default:
      return 10; // fallback
  }
}

