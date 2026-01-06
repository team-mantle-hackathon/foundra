import { useMutation, useQueryClient } from "@tanstack/react-query";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";

type ProgressFn = (s: string | null) => void;

export function useRejectProjectAdmin(setProgress?: ProgressFn) {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const config = useConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: { id: string; reason: string; onchain_id: number }) => {
      setProgress?.("Simulating tx (pre-check)...");
      const { request } = await simulateContract(config, {
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: "rejectProject",
        args: [BigInt(project.onchain_id), project.reason],
        account: address,
      });

      setProgress?.("Waiting wallet confirmation...");
      const hash = await writeContractAsync(request);

      setProgress?.("Transaction sent. Waiting confirmation...");
      await waitForTransactionReceipt(config, { hash });

      setProgress?.("Updating project status + reject reason (DB)...");
      const { error: projErr } = await supabase
        .from("projects")
        .update({ status: "REJECTED", reject_reason: project.reason })
        .eq("id", project.id);

      if (projErr) throw projErr;

      setProgress?.("Done.");
      return { hash, reason: project.reason };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });
}
