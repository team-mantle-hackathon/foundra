import { useMutation } from "@tanstack/react-query";
import { readContract, simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { vaultAbi } from "@/constants/abi/abi-rwa-vault";
import { supabase } from "@/lib/supabase";

interface RedeemParams {
  vaultId: string;
  vaultAddress: `0x${string}`;
  shares: bigint;
}

export function useRedeem() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  return useMutation({
    mutationFn: async ({ vaultId, vaultAddress, shares }: RedeemParams) => {
      if (!address) throw new Error("Wallet not connected");
      
      const sharesContract = await readContract(config, {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "balanceOf",
        args: [address],
      }) as bigint;

      if (sharesContract === 0n) {
        throw new Error("No shares to redeem");
      }
      
      const { data: user } = await supabase
          .from("user_auths")
          .select("id")
          .eq("wallet_address", address)
          .single();
  
        if (!user) throw new Error("User not found");
      
      const { request, result: assetsReceived } = await simulateContract(config, {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "redeem",
        args: [shares, address, address],
        account: address
      })
      
      const txHash = await writeContractAsync(request);

      const receipt = await waitForTransactionReceipt(config as any, {
        hash: txHash,
      });
      
      const { error } = await supabase.from("vault_redemptions").insert({
        vault_id: vaultId,
        investor_id: user.id,
        assets_received: assetsReceived.toString(),
        shares_redeemed: shares.toString(),
        tx_hash: receipt.transactionHash,
      });
      
      if (error) throw new Error(error.message)

      return {
        txHash: receipt.transactionHash,
        shares,
      };
    },
  });
}
