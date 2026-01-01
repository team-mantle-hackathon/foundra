import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Check, CheckCircle2, Github, Loader2, ShieldCheck } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";

export default function VerificationInvestor(): ReactNode {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [statusMsg, setStatusMsg] = useState("");
  const [reclaimUrl, setReclaimUrl] = useState<string | null>(null);

  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  const kycMutation = useMutation({
    mutationFn: async () => {
      setStatusMsg("Initializing Reclaim...");

      const reclaimRequest = await ReclaimProofRequest.init(
        import.meta.env.VITE_RECLAIM_APP_ID,
        import.meta.env.VITE_RECLAIM_APP_SECRET,
        import.meta.env.VITE_RECLAIM_PROVIDER_ID,
      );

      const requestUrl = await reclaimRequest.getRequestUrl();
      setReclaimUrl(requestUrl);

      if (isMobile) {
        setStatusMsg("Opening Reclaim App...");
        window.location.href = requestUrl;
      } else {
        setStatusMsg("Scan QR using Reclaim Verifier App!");
      }

      return new Promise((resolve, reject) => {
        reclaimRequest.startSession({
          onSuccess: async (proofs) => {
            try {
              setStatusMsg("Proof received! Signing with Witness...");

              const { data, error } = await supabase.functions.invoke(
                "verify-proof-zk",
                {
                  body: {
                    proof: proofs,
                    userAddress: address,
                  },
                },
              );

              if (error) throw new Error(error.message);

              setStatusMsg("Submitting to Mantle Network...");
              
              const txHash = await writeContractAsync({
                address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
                abi: protocolAbi,
                functionName: "verifyProof",
                args: [data.claimId, data.signature],
              });
              
              const { error: dbError } = await supabase
                .from("user_auths")
                .update({
                  is_verified: true,
                  zk_proof: proofs,          // full proof (jsonb)
                  kyc_data: {
                    provider: "reclaim",
                    claimId: data.claimId,
                    verifiedAt: new Date().toISOString(),
                  },
                  reclaim_session_id: data.claimid ?? null,
                  updated_at: new Date().toISOString(),
                })
                .eq("wallet_address", address);
              
              if (dbError) {
                throw new Error("DB update failed: " + dbError.message);
              }

              resolve(txHash);
            } catch (err) {
              reject(err);
            }
          },
          onError: (error) => {
            reject(error);
          },
        });
      });
    },
    onSuccess: () => {
      setStatusMsg("Verification Success!");
      setReclaimUrl(null);
    },
    onError: (error: any) => {
      setStatusMsg(`Error: ${error.message || "Unexpected Error"}`);
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Project Owner Verification
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Verifikasi identity via Reclaim Protocol
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Verification GitHub</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero-Knowledge Proof</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>On-chain Verification</span>
            </div>
          </div>

          <Button
            onClick={() => kycMutation.mutate()}
            disabled={kycMutation.isPending || !address}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm uppercase"
          >
            {kycMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" />
                Verify Identity
              </>
            )}
          </Button>

          {reclaimUrl && !isMobile && (
            <div className="flex flex-col items-center gap-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  reclaimUrl,
                )}`}
                alt="Reclaim QR"
                className="rounded-lg border border-slate-800"
              />
              <p className="text-[10px] text-slate-400 text-center">
                Scan using <b>Reclaim Verifier app</b> in your mobile phone
              </p>
            </div>
          )}

          {statusMsg && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-[10px] font-mono border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              {statusMsg !== 'Verification Success!' ? <Loader2 className="w-3 h-3 mt-0.5 animate-spin" /> : <Check className="w-3 h-3 mt-0.5"/>}
              <span className="break-all">{statusMsg}</span>
            </div>
          )}

          {!address && (
            <p className="text-[10px] text-red-500 text-center font-bold uppercase">
              Connect wallet required
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
