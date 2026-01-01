// src/hooks/use-admin-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useDashboardAdmin() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [
        pendingOwners,
        pendingProjects,
        fundraisingPools,
        disburseReadyPools,
        completedProjects
      ] = await Promise.all([
        supabase
          .from("project_owners")
          .select("id", { count: "exact", head: true })
          .eq("is_verified", false),

        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("status", "PENDING"),

        supabase
          .from("vaults")
          .select("id", { count: "exact", head: true })
          .eq("status", "FUNDRAISING"),

        supabase
          .from("vaults")
          .select("id", { count: "exact", head: true })
          .eq("status", "ACTIVE"),

        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("status", "COMPLETED"),
      ]);

      return {
        pendingOwners: pendingOwners.count ?? 0,
        pendingProjects: pendingProjects.count ?? 0,
        fundraisingPools: fundraisingPools.count ?? 0,
        disburseReadyPools: disburseReadyPools.count ?? 0,
        completedProjects: completedProjects.count ?? 0,
      };
    },
  });
}
