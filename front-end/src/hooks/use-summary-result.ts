import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type VaultRow = {
  funds: string;        // numeric -> string
  status: string;
  deleted_at: string | null;
  project_id: string | null;
};

type ProjectRow = {
  id: string;
  target_apy: string;   // numeric -> string
  status: string;
  deleted_at: string | null;
};

const ACTIVE_VAULT_STATUSES = ["FUNDRAISING", "ACTIVE", "REPAYING"] as const;

const toNum = (x: unknown) => Number(x ?? 0);

export function useSummaryResult() {
  return useQuery({
    queryKey: ["protocol-status"],
    staleTime: 10_000,
    refetchInterval: 20_000,
    queryFn: async () => {
      // 1) Pull active vaults (funds + project_id)
      const { data: vaults, error: vErr } = await supabase
        .from("vaults")
        .select("funds,status,deleted_at,project_id")
        .is("deleted_at", null)
        .in("status", [...ACTIVE_VAULT_STATUSES]);

      if (vErr) throw vErr;

      const rows = (vaults ?? []) as VaultRow[];

      const totalFundedRaw = rows.reduce((acc, r) => acc + toNum(r.funds), 0);
      const activeVaults = rows.length;

      // 2) Avg Target APY from projects (project owner input)
      const projectIds = Array.from(new Set(rows.map(r => r.project_id).filter(Boolean))) as string[];

      let avgTargetApy = 0;

      if (projectIds.length > 0) {
        const { data: projects, error: pErr } = await supabase
          .from("projects")
          .select("id,target_apy,status")
          .in("id", projectIds)
          .eq("status", "ACTIVE");

        if (pErr) throw pErr;

        const ps = (projects ?? []) as ProjectRow[];
        if (ps.length > 0) {
          const sumApy = ps.reduce((acc, p) => acc + toNum(p.target_apy), 0);
          avgTargetApy = sumApy / ps.length;
        }
      }

      return {
        totalFundedRaw,  // raw USDC (6 decimals) -> pakai helper lu
        activeVaults,
        avgTargetApy,    // percent number (e.g. 12)
      };
    },
  });
}
