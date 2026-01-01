// src/hooks/use-projects.ts
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { supabase } from "@/lib/supabase";

export function useProjects() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["projects", address],
    enabled: !!address,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          status,
          ai_risk_grade,
          ai_risk_score,
          target,
          onchain_id,
          tx_hash,
          created_at,
          project_owners!inner (
            id,
            user_auths!inner (
              wallet_address
            )
          ),
          vaults (
            id,
            status,
            funds,
            target_funds,
            expected_yield,
            tenor,
            address_vault,
            tx_hash,
            total_owed,
            
            vault_repayment_summary (
              total_repaid
            )
          )
        `)
        .eq("project_owners.user_auths.wallet_address", address)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const enriched = data.map((project) => ({
        ...project,
        vaults: project.vaults.map((vault) => {
          const totalRepaid =
            vault.vault_repayment_summary?.[0]?.total_repaid ?? 0;

          return {
            ...vault,
            outstanding: BigInt(vault.total_owed) - BigInt(totalRepaid),
            total_repaid: BigInt(totalRepaid),
          };
        }),
      }));

      return enriched;
    },
  });
}
