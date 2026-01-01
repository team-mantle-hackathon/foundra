import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type VaultDetail = {
  id: string;
  name: string;
  location: string;
  description?: string;
  apy: number;
  tenor: string;
  risk: string;
  status_vault: string;
};

type VaultRow = {
  status: string;
  tenor: number;
  address_vault: string;
  projects: {
    id: string;
    name: string;
    location: string;
    description?: string;
    ai_risk_grade?: string;
    target_apy: number;
    estimated_durations: number;
  };
};


export function useVaultDetail(vaultAddress: string) {
  return useQuery<VaultDetail>({
    queryKey: ["vault-detail", vaultAddress],
    enabled: !!vaultAddress,
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vaults")
        .select(`
          status,
          tenor,
          address_vault,
          projects (
            id,
            name,
            location,
            description,
            ai_risk_grade,
            target_apy,
            estimated_durations
          )
        `)
        .eq("address_vault", vaultAddress)
        .single()
        .overrideTypes<VaultRow>(); 

      if (error) throw error;

      const project = data.projects;

      if (!project) {
        throw new Error("Project not found for this vault");
      }

      return {
        id: project.id,
        name: project.name,
        location: project.location,
        description: project.description,
        apy: Number(project.target_apy),
        tenor: `${data.tenor ?? project.estimated_durations} Months`,
        risk: project.ai_risk_grade ?? "TBA",
        status_vault: data.status ?? "UNKNOWN",
      };
    },
  });
}
