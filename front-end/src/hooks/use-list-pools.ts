import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useListPools() {
  return useQuery({
    queryKey: ["list-pools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vaults")
        .select(`
          id,
          status,
          tenor,
          address_vault,
          funds,
          target_funds,
          projects (
            name,
            location,
            target_apy,
            ai_risk_grade,
            ai_risk_score
          )
        `)
        .notIn("status", ["CANCELLED", "PENDING"]);

      if (error) throw new Error(error.message);

      return data.map((v) => {
        const project = Array.isArray(v.projects)
          ? v.projects[0]
          : v.projects;
        
        const funds = BigInt(v.funds ?? 0);
        const target_funds = BigInt(v.target_funds ?? 0);

        const progressBps =
          target_funds === 0n ? 0 : Number((funds * 10_000n) / target_funds); // 0..10000
        const progressPct = Math.min(100, Math.floor(progressBps / 100)); // 0..100
        
        return {
          id: v.id,
          name: project.name,
          address_vault: v.address_vault,
          location: project.location,
          apy: `${project.target_apy}%`,
          tenor: `${v.tenor} Months`,
          funds,
          target_funds,
          progressPct,
          risk: `${project.ai_risk_grade} ${project.ai_risk_score}`,
          status_vault: v.status
        }
      });
    },
  });
}
