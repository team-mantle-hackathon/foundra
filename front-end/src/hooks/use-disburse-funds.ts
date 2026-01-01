import { useMutation } from "@tanstack/react-query";
import { readContract, simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { vaultAbi } from "@/constants/abi/abi-rwa-vault";
import { supabase } from "@/lib/supabase";

interface DisburseParams {
  vaultId: string;
  vaultAddress: `0x${string}`;
}

export function useDisburseFunds() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const config = useConfig();

  return useMutation({
    mutationFn: async ({ vaultId, vaultAddress }: DisburseParams) => {
      const { request } = await simulateContract(config, {
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS,
        abi: protocolAbi,
        functionName: "disburseVaultFunds",
        args: [vaultAddress],
        account: address,
      });
      
      const txHash = await writeContractAsync(request);

      const receipt = await waitForTransactionReceipt(config as any, {
        hash: txHash,
      });
      
      const result = await readContract(config, {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "getRepaymentInfo"
      });

      const { error } = await supabase
        .from("vaults")
        .update({
          status: "REPAYING",
          updated_at: new Date().toISOString(),
          total_owed: result.totalOwed.toString()
        })
        .eq("id", vaultId);

      if (error) throw error;

      return receipt.transactionHash;
    },
  });
}
