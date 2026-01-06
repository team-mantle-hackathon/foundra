import { useMutation } from "@tanstack/react-query";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { vaultAbi } from "@/constants/abi/abi-rwa-vault";
import { supabase } from "@/lib/supabase";

type ProgressFn = (s: string | null) => void;

interface DisburseParams {
  vaultId: string;
  vaultAddress: `0x${string}`;
}

export function useDisburseFunds(setProgress?: ProgressFn) {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const config = useConfig();

  return useMutation({
    mutationFn: async ({ vaultId, vaultAddress }: DisburseParams) => {
      setProgress?.("Simulating tx (pre-check)...");
      const { request } = await simulateContract(config, {
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: "disburseVaultFunds",
        args: [vaultAddress],
        account: address,
      });

      setProgress?.("Waiting wallet confirmation...");
      const txHash = await writeContractAsync(request);

      setProgress?.("Transaction sent. Waiting confirmation...");
      const receipt = await waitForTransactionReceipt(config as any, {
        hash: txHash,
      });

      setProgress?.("Reading repayment info from vault...");
      const result: any = await readContract(config, {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "getRepaymentInfo",
      });
      
      const nextDueDate = (result.nextDueDate ?? result[3]) as bigint; // uint256 seconds
      
      const dueRepayment = new Date(Number(nextDueDate) * 1000)
        .toISOString()
        .slice(0, 10);

      setProgress?.("Updating vault status (DB)...");
      const { error } = await supabase
        .from("vaults")
        .update({
          status: "REPAYING",
          updated_at: new Date().toISOString(),
          total_owed: result.totalOwed.toString(),
          due_repayment: dueRepayment
        })
        .eq("id", vaultId);

      if (error) throw error;

      setProgress?.("Done.");
      return receipt.transactionHash as string;
    },
  });
}
