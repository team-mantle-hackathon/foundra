import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useRedeemedVaults(walletAddress?: string) {
  return useQuery({
    queryKey: ["redeemed-vaults", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const { data: user, error: userErr } = await supabase
        .from("user_auths")
        .select("id")
        .eq("wallet_address", walletAddress)
        .single();

      if (userErr) throw userErr;
      if (!user) return new Set<string>();

      const { data, error } = await supabase
        .from("vault_redemptions")
        .select("vault_id")
        .eq("investor_id", user.id);

      if (error) throw error;

      return new Set((data ?? []).map((r) => r.vault_id));
    },
  });
}
