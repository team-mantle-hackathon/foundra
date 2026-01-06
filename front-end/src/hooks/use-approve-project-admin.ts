import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";

type ProgressFn = (s: string | null) => void;

export function useApproveProjectAdmin(setProgress?: ProgressFn) {
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
      setProgress?.("Simulating tx (pre-check)...");
      const { request } = await simulateContract(config, {
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: "approveProject",
        args: [BigInt(project.onchain_id)],
        account: address,
      });

      setProgress?.("Waiting wallet confirmation...");
      const hash = await writeContractAsync(request);

      setProgress?.("Transaction sent. Waiting confirmation...");
      await waitForTransactionReceipt(config, { hash });

      setProgress?.("Reading vault address from registry...");
      const vaultAddress = await readContract(config, {
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
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

      setProgress?.("Updating project status (DB)...");
      const { error: projErr } = await supabase
        .from("projects")
        .update({ status: "ACTIVE" })
        .eq("id", project.id);

      if (projErr) throw projErr;

      const tenorMonths = project.estimated_durations * 12;

      setProgress?.("Creating vault record (DB)...");
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

      setProgress?.("Done.");
      return { hash, vaultAddress };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });
}
