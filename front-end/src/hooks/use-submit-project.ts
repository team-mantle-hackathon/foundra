import { useMutation } from "@tanstack/react-query";
import { simulateContract, waitForTransactionReceipt } from "@wagmi/core"; 
import axios from "axios";
import { decodeEventLog } from "viem";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { extractPdfText } from "@/lib/pdfParse";
import { supabase } from "@/lib/supabase";
import { apyFromGrade } from "@/lib/utils";

export function useSubmitProject(setProgress?: (v: string) => void) {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const config = useConfig();

  return useMutation({
    mutationFn: async (payload: any) => {
      const folderName = `rwa-${Date.now()}`;
      const files = Object.entries(payload)
        .filter(([_, v]) => v instanceof File)
        .map(([key, file]) => new File([file as File], `${folderName}/${key}-${Date.now()}.pdf`, { type: (file as File).type }));

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file); 
      });
      
      const documents = [];
      
      for (const [key, value] of Object.entries(payload)) {
        if (value instanceof File) {
          
          const text = await extractPdfText(value);
          
          documents.push({
            name: key,
            text: text.slice(0, 12_000),
          });
        }
      }
      
      setProgress?.("Uploading documents to IPFS…");
      
      const { data: pinata } = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${import.meta.env.VITE_JWT_IPFS}`,
            "Content-Type": "multipart/form-data" 
          } 
        }
      );
      const cid = `ipfs://${pinata.IpfsHash}`;
      
      setProgress?.("Running AI risk assessment…");
      
      // call AI
      const { data: ai, error } = await supabase.functions.invoke(
        "ai-risk-assessment",
        {
          body: {
            documents
          },
        }
      );
      if (error) throw new Error(error);
      
      const apyBps = Math.round(apyFromGrade(ai.riskGrade) * 100);
      
      setProgress?.("Submitting project on-chain…");

      const {request} = await simulateContract(config, {
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: "proposeProject",
        args: [
          {
            projectName: payload.name,
            location: payload.location,
            estimatedBudget: BigInt(Math.floor(payload.estimated_budget * 1_000_000)),
            requestedAmount: BigInt(Math.floor(payload.target * 1_000_000)),
            estimatedDuration: BigInt(payload.estimated_durations * 31536000),
            documents: cid,
            status: 0,
            aiRiskGrade: ai.riskGrade,
            aiRiskScore: BigInt(ai.riskScore),
            targetAPY: BigInt(apyBps)
          },
        ],
        account: address
      })
      
      const hash = await writeContractAsync(request);
      
      setProgress?.("Waiting for blockchain confirmation…");

      const receipt = await waitForTransactionReceipt(config as any, { hash });
      
      const log = decodeEventLog({
        abi: protocolAbi,
        eventName: "ProjectProposed",
        data: receipt.logs[0].data,
        topics: receipt.logs[0].topics,
      });
      
      const onchainId = Number((log.args as any).projectId);
      
      setProgress?.("Finalizing & saving project data…");

      const { data: auth, error: authErr } = await supabase
        .from('user_auths')
        .select('id')
        .eq('wallet_address', address)
        .single();
      
      if (authErr || !auth) throw new Error("Wallet belum terdaftar di sistem (user_auths)!");

      const { data: owner, error: ownerErr } = await supabase
        .from('project_owners')
        .select('id')
        .eq('user_auth_id', auth.id)
        .single();
      
      if (ownerErr || !owner) throw new Error("Profile owner tidak ditemukan!");

      const cleanData = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => !(v instanceof File))
      );

      const { error: insertErr } = await supabase.from('projects').insert({
        ...cleanData,
        target_apy: apyFromGrade(ai.riskGrade),
        estimated_budget:BigInt(Math.floor(payload.estimated_budget * 1_000_000)).toString(),
        target:BigInt(Math.floor(payload.target * 1_000_000)).toString(),
        ai_risk_grade: ai.riskGrade,
        ai_risk_score: ai.riskScore,
        ai_risk_audit: ai,
        onchain_id: onchainId,
        project_owner_id: owner.id,
        ipfs_documents: cid,
        tx_hash: hash,
        status: 'PENDING'
      });

      if (insertErr) throw insertErr;
      
      setProgress?.("Done");

      return { onchainId, hash };
    }
  });
}