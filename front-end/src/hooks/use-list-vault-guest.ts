// src/hooks/use-featured-vaults.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const ACTIVE_VAULT_STATUSES = ["FUNDRAISING", "ACTIVE", "REPAYING"] as const;

type FeaturedVault = {
  id: string;
  address_vault: string;
  funds: number;        // raw USDC (6 decimals)
  target_funds: number; // raw USDC (6 decimals)
  project: {
    name: string;
    location: string;
    target_apy: number;
    ai_risk_grade: string;
  };
  tenorMonths: number;
};

const toNum = (x: unknown) => Number(x ?? 0);

export function useListVaultGuest(limit?: number) {
  return useQuery({
    queryKey: ["featured-vaults", limit ?? 'all'],
    staleTime: 10_000,
    refetchInterval: 20_000,
    queryFn: async (): Promise<FeaturedVault[]> => {
      let queryVault = supabase
        .from("vaults")
        .select(
          `
          id,
          tenor,
          status,
          deleted_at,
          address_vault,
          target_funds,
          funds,
          project:projects (
            name,
            location,
            target_apy,
            ai_risk_grade,
            status
          )
        `
        )
        .is("deleted_at", null)
        .in("status", [...ACTIVE_VAULT_STATUSES])
        .order("created_at", { ascending: false })

      if (typeof limit === "number") queryVault = queryVault.limit(limit);
      
      const { data, error } = await queryVault;
      if (error) throw error;

      const rows = (data ?? []) as any[];

      // filter safety (in case project missing / soft deleted)
      return rows
        .filter((r) => r.project && r.project.deleted_at == null && r.project.status === "ACTIVE")
        .map((r) => ({
          id: r.id,
          tenorMonths: Math.round(toNum(r.tenor)),
          funds: toNum(r.funds),
        target_funds: toNum(r.target_funds),
          address_vault: r.address_vault,
          project: {
            name: r.project.name ?? "-",
            location: r.project.location ?? "-",
            target_apy: toNum(r.project.target_apy),
            ai_risk_grade: r.project.ai_risk_grade ?? "TBA",
          },
        }));
    },
  });
}
