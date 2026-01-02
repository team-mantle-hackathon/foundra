import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useVaultDetailGuest(address?: string) {
  return useQuery({
    queryKey: ["vault-detail-guest", address],
    enabled: !!address,
    staleTime: 10_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vaults")
        .select(`
          id,
          address_vault,
          status,
          funds,
          target_funds,
          tenor,
          due_repayment,
          tx_hash,
          project:projects (
            id,
            name,
            location,
            target_apy,
            ai_risk_grade,
            ai_risk_score,
            status,
            description
          )
        `)
        .eq("address_vault", address!)
        .single();

      if (error) throw error;
      if (!data) return null;

      const v: any = data;

      return {
        id: v.id,
        addressVault: v.address_vault,
        status: v.status,
        fundsRaw: BigInt(v.funds ?? 0),
        targetRaw: BigInt(v.target_funds ?? 0),
        tenorMonths: Number(v.tenor ?? 0),
        dueRepayment: v.due_repayment as string | null,
        deployTxHash: v.tx_hash as string | null,
        project: {
          name: v.project?.name ?? "-",
          location: v.project?.location ?? "-",
          targetApy: Number(v.project?.target_apy ?? 0),
          riskGrade: v.project?.ai_risk_grade ?? "TBA",
          riskScore: Number(v.project?.ai_risk_score ?? 0),
          status: v.project?.status ?? "UNKNOWN",
          description: v.project?.description ?? "-",
        },
      };
    },
  });
}
