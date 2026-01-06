import { useMutation } from "@tanstack/react-query";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseEventLogs } from "viem";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { abiERC20 } from "@/constants/abi/abi-erc20";
import { vaultAbi } from "@/constants/abi/abi-rwa-vault";
import { supabase } from "@/lib/supabase";

interface RepayParams {
  id: string;
  vaultAddress: `0x${string}`;
  amount: bigint;
}

export function useRepay() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  return useMutation({
    mutationFn: async ({ id, vaultAddress, amount }: RepayParams) => {
      if (!address) throw new Error("Wallet not connected");
      if (amount <= 0n) throw new Error("Invalid repay amount");
      
      const { data: userAuth, error: userAuthError } = await supabase
        .from("user_auths")
        .select("id")
        .eq("wallet_address", address)
        .single();

      if (userAuthError) {
        throw new Error("User auth not found");
      }
      
      const { data: projectOwner, error: projectOwnerError } = await supabase
        .from("project_owners")
        .select("id")
        .eq("user_auth_id", userAuth.id)
        .single();

      if (projectOwnerError || !projectOwner) {
        throw new Error("Project owner not found");
      }
      
      const {request: requestApprove} = await simulateContract(config, {
        address: import.meta.env.VITE_USDC_ADDRESS,
        abi: abiERC20,
        functionName: "approve",
        args: [vaultAddress, amount],
        account: address
      })
      
      const approveTx = await writeContractAsync(requestApprove);
      
      await waitForTransactionReceipt(config as any, {
        hash: approveTx,
      });
      
      const { request } = await simulateContract(config, {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "repay",
        args: [amount],
        account: address
      })

      const hash = await writeContractAsync(request);

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt.status !== "success") {
        throw new Error("Repayment transaction failed");
      }

      const logs = parseEventLogs({
        abi: vaultAbi,
        logs: receipt.logs,
        eventName: "RepaymentMade",
      });

      if (!logs.length) {
        throw new Error("Repayment event not found");
      }

      const repaymentEvent = logs[0].args;
      
      const { data: vaultRow, error: vaultErr } = await supabase
        .from("vaults")
        .select("total_owed,status")
        .eq("id", id)
        .single();

      if (vaultErr || !vaultRow) throw new Error("Vault not found");

      const totalOwed = BigInt(vaultRow.total_owed ?? 0);

      const { data: repayRows, error: repayErr } = await supabase
        .from("vault_repayments")
        .select("amount")
        .eq("vault_id", id);

      if (repayErr) throw repayErr;

      const totalRepaid = (repayRows ?? []).reduce((acc, r) => {
        return acc + BigInt(r.amount);
      }, 0n);

      const nextStatus = totalRepaid >= totalOwed ? "COMPLETED" : "REPAYING";

      const { error: updErr } = await supabase
        .from("vaults")
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updErr) throw updErr;

      const { error } = await supabase.from("vault_repayments").insert({
        vault_id: id,
        tx_hash: hash,
        project_owner_id: projectOwner.id,
        amount: repaymentEvent.amount.toString(),
      });

      if (error) throw error;

      return {
        txHash: hash,
        totalRepaid,
        totalOwed,
        amount: repaymentEvent.amount,
      };
    },
  });
}
