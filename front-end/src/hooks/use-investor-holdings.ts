import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type InvestorHoldingRow = {
  funds: string;
  token_shares: string;
  vaults: {
    id: string;
    status: string;
    tenor: number;
    address_vault: string;
    projects: {
      name: string;
      status: string;
      target_apy: number;
    };
  };
};


export function useInvestorHoldings(walletAddress?: string) {
  return useQuery({
    queryKey: ["investor-holdings", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vault_investors")
        .select(`
          funds,
          token_shares,
          user_auths!inner (
            wallet_address
          ),
          vaults (
            id,
            status,
            tenor,
            address_vault,
            projects (
              name,
              status,
              target_apy
            )
          )
        `)
        .eq("user_auths.wallet_address", walletAddress)
        .order("created_at", {ascending: false})
        .overrideTypes<Array<InvestorHoldingRow>>();

      if (error) throw error;

      return data.map((row) => {
        const fundsRaw = BigInt(row.funds); // micro USDC
        
        const apyPercent = Number(row.vaults.projects.target_apy); // 10.5
        const tenorMonths = Number(row.vaults.tenor);              // 24
        
        const years = tenorMonths / 12;
        
        const estReturnRaw =
          BigInt(Math.floor(
            Number(fundsRaw) * (apyPercent / 100) * years
          ));
      
        return {
          id: row.vaults.id,
          name: row.vaults.projects.name,
          apy: row.vaults.projects.target_apy,
          address_vault: row.vaults.address_vault,
          shares: row.token_shares,
          amount: row.funds,          // RAW
          estReturn: estReturnRaw,    // RAW
          status_vault: row.vaults.status,
          status_project: row.vaults.projects.status,
        };
      });

    },
  });
}
