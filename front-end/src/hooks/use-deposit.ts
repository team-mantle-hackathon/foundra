import { useMutation } from "@tanstack/react-query";
import { readContract, simulateContract, waitForTransactionReceipt } from "@wagmi/core"; 
import { parseEventLogs } from "viem";
import {
	useAccount,
	useConfig,
	useWriteContract,
} from "wagmi";
import { abiERC20 } from "@/constants/abi/abi-erc20";
import { vaultAbi } from "@/constants/abi/abi-rwa-vault";
import { supabase } from "@/lib/supabase";

interface InvestParams {
	vaultId: string;
	vaultAddress: `0x${string}`;
	amount: bigint;
}

export function useDeposit() {
	const { address } = useAccount();
	const { writeContractAsync } = useWriteContract();
	const config = useConfig();

	return useMutation({
		mutationFn: async ({
			vaultId,
			vaultAddress,
			amount
		}: InvestParams) => {
		  if (!address) throw new Error("Wallet not connected");

      const { data: user, error: errorUser } = await supabase
        .from("user_auths")
        .select("id")
        .eq("wallet_address", address)
        .single();

      if (errorUser) throw errorUser;

      const investorId = user.id;
      
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
      
      const {request: requestDeposit} = await simulateContract(config, {
				address: vaultAddress,
				abi: vaultAbi,
				functionName: "deposit",
				args: [amount, address],
				account: address
			})

			const txHash = await writeContractAsync(requestDeposit);

			const receipt = await waitForTransactionReceipt(config as any, { hash: txHash });

			const logs = parseEventLogs({
        abi: vaultAbi,
        logs: receipt.logs,
        eventName: "FundsDeposited",
      });
      
      if (logs.length === 0) {
        throw new Error("FundsDeposited event not found");
      }
      
      const { assets, shares } = logs[0].args;

			const { error } = await supabase.from("vault_investors").insert({
				vault_id: vaultId,
				investor_id: investorId,
				funds: assets.toString(),
				token_shares: shares.toString(),
				tx_hash: receipt.transactionHash,
			});

			if (error) throw error;
			
			const { error: errorIncrement } = await supabase.rpc(
        "increment_vault_funds",
        {
          p_vault_id: vaultId,
          p_amount: assets.toString(),
        }
      );
      
      if (errorIncrement) throw errorIncrement;

			return {
				txHash: receipt.transactionHash,
				shares,
			};
		},
	});
}
