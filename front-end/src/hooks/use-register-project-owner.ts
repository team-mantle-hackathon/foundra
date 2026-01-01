import { useMutation } from "@tanstack/react-query";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";
import { useUploadIPFS } from "./use-upload-ipfs";

export const useRegisterProjectOwner = () => {
  const config = useConfig();
  const { address, chainId } = useAccount();
  const { mutateAsync: uploadIPFS } = useUploadIPFS();
  const { writeContractAsync } = useWriteContract();
  
  console.log(chainId);

  return useMutation({
    mutationFn: async (data: { companyName: string; regNumber: string; file: File }) => {
      console.log("1. Starting registration for:", address);
      if (!address) throw new Error("Wallet not connected");
      
      const { data: userData, error: userError } = await supabase
        .from('user_auths')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (userError || !userData) throw new Error("User record not found in database.");
      console.log("2. User ID found:", userData.id);

      // STEP 2: IPFS
      console.log("3. Uploading to IPFS...");
      const ipfsLink = await uploadIPFS(data.file);
      console.log("4. IPFS Link:", ipfsLink);

      // STEP 3: Smart Contract (Direct Write)
      console.log("5. Requesting wallet signature...");
      
      const {request} = await simulateContract(config, {
        chainId,
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: 'registerDeveloper',
        args: [data.companyName, data.regNumber, ipfsLink],
        account: address
      })
      
      const txHash = await writeContractAsync(request);
      
      console.log("6. TX Hash received:", txHash);

      // STEP 4: Wait confirmation
      console.log("7. Waiting for block confirmation...");
      await waitForTransactionReceipt(config, { hash: txHash, chainId });

      // STEP 5: DB Sync
      console.log("8. Syncing to Supabase...");
      const { error: dbError } = await supabase
        .from('project_owners')
        .insert({
          user_auth_id: userData.id,
          company_name: data.companyName,
          reg_number: data.regNumber,
          license_ipfs_link: ipfsLink,
          tx_hash: txHash
        });

      if (dbError) throw dbError;
      console.log("9. All Done!");

      return { txHash, ipfsLink };
    },
  });
};