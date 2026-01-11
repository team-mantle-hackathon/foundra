import { useMutation } from "@tanstack/react-query";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";
import { uploadDocumentIdentity } from "@/lib/uploadDocumentIdentity";
import { useUploadIPFS } from "./use-upload-ipfs";

export function useRegisterProjectOwner(setProgress?: (v: string) => void) {
  const config = useConfig();
  const { address, chainId } = useAccount();
  const { mutateAsync: uploadIPFS } = useUploadIPFS();
  const { writeContractAsync } = useWriteContract();

  return useMutation({
    mutationFn: async (data: { name: string, documentIdentity: File, companyName: string; regNumber: string; file: File }) => {
      setProgress?.("1. Starting registration for:" + address);
      if (!address) throw new Error("Wallet not connected");
      
      const { data: userData, error: userError } = await supabase
        .from('user_auths')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (userError || !userData) throw new Error("User record not found in database.");
      setProgress?.("2. User ID found:" + userData.id);
      
      setProgress?.("3 Uploading identity document to Supabase...");
      const { path: identityPath } = await uploadDocumentIdentity({
        userId: userData.id,
        file: data.documentIdentity,
      });

      setProgress?.("4. Uploading to IPFS...");
      const ipfsLink = await uploadIPFS(data.file);
      setProgress?.("5. IPFS Link:" + ipfsLink);

      setProgress?.("6. Requesting wallet signature...");
      
      const {request} = await simulateContract(config, {
        chainId,
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: 'registerDeveloper',
        args: [data.companyName, data.regNumber, ipfsLink],
        account: address
      })
      
      const txHash = await writeContractAsync(request);
      
      setProgress?.("7. TX Hash received:" + txHash);

      setProgress?.("8. Waiting for block confirmation...");
      await waitForTransactionReceipt(config, { hash: txHash, chainId });

      setProgress?.("9. Syncing to database...");
      const { error: dbError } = await supabase
        .from('project_owners')
        .insert({
          user_auth_id: userData.id,
          company_name: data.companyName,
          reg_number: data.regNumber,
          license_ipfs_link: ipfsLink,
          tx_hash: txHash,
          document_identity: `https://lywccuofxnncevibdybb.supabase.co/storage/v1/object/public/kyc-manual/${identityPath}`
        });

      if (dbError) throw dbError;
      
      const { error: dbUserError } = await supabase
        .from('user_auths')
        .update({"name": data.name})
        .eq("wallet_address", address)
      
      if (dbUserError) throw dbUserError;
      
      setProgress?.("10. All Done!");

      return { txHash, ipfsLink };
    },
  });
};