import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readContract, simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";

export function useApproveProjectAdmin() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const config = useConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: {
      id: string;
      target: number;
      estimated_durations: number;
      onchain_id: number;
    }) => {
      
      const {request} = await simulateContract(config, {
        address: import.meta.env
          .VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: "approveProject",
        args: [BigInt(project.onchain_id)],
        account: address
      })
      
      const hash = await writeContractAsync(request);

      await waitForTransactionReceipt(config, { hash });

      const vaultAddress = await readContract(config, {
        address: import.meta.env
          .VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: "getVaultAddress",
        args: [BigInt(project.onchain_id)],
      });

      if (
        !vaultAddress ||
        vaultAddress === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error("Vault address not created");
      }

      const { error: projErr } = await supabase
        .from("projects")
        .update({
          status: "ACTIVE",
        })
        .eq("id", project.id);

      if (projErr) throw projErr;
      
      const tenorMonths = project.estimated_durations * 12;

      const { error: vaultErr } = await supabase.from("vaults").insert({
        project_id: project.id,
        target_funds: project.target,
        funds: 0,
        expected_yield: 0,
        tenor: tenorMonths,
        status: "FUNDRAISING",
        address_vault: vaultAddress,
        tx_hash: hash,
      });

      if (vaultErr) throw vaultErr;

      return { hash, vaultAddress };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });
}
