import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useProjectsAdmin() {
  return useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          location,
          status,
          estimated_durations,
          ai_risk_grade,
          ai_risk_score,
          target,
          onchain_id,
          ipfs_documents,
          tx_hash,
          created_at,
          vaults (
            id,
            status,
            funds,
            target_funds,
            expected_yield,
            tenor,
            address_vault,
            tx_hash
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
