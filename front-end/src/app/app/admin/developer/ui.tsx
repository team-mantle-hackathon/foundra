import { waitForTransactionReceipt } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useConfig, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";

export default function AdminDeveloper() {
  const [pendingDevs, setPendingDevs] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  // 1. Ambil data developer yang daftar tapi belum approved dari Supabase
  const fetchDevs = async () => {
    const { data } = await supabase
      .from('user_auths')
      .select('*')
      .eq('role', 'project-owner');
    if (data) setPendingDevs(data);
  };

  useEffect(() => { fetchDevs(); }, []);

  // 2. Eksekusi Approve di Smart Contract
  const handleApprove = async (walletAddress: string) => {
    setIsSyncing(true);
    try {
      // GAS KE CONTRACT
      const hash = await writeContractAsync({
        address: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS as `0x${string}`,
        abi: protocolAbi,
        functionName: "approveDeveloper",
        args: [walletAddress as `0x${string}`],
      });

      // TUNGGU RESI
      await waitForTransactionReceipt(config, { hash });

      // UPDATE SUPABASE BIAR ILANG DARI TABEL PENDING
      await supabase
        .from('user_auths')
        .update({ is_verified: true })
        .eq('wallet_address', walletAddress);

      alert("SUCCESS: Developer Approved On-Chain!");
      fetchDevs();
    } catch (e) {
      console.error(e);
      alert("FAILED: Check if you are the Admin!");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pt-24 px-8 bg-slate-950 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase italic">Developer Verification</h1>
        <p className="text-slate-500 text-xs">Confirm institutional developers to allow project submissions.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left">Wallet Address</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pendingDevs.map((dev) => (
              <tr key={dev.id} className="hover:bg-white/2">
                <td className="px-6 py-4 font-mono text-xs">{dev.wallet_address}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-bold">
                    Pending On-Chain
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    disabled={isSyncing}
                    onClick={() => handleApprove(dev.wallet_address)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isSyncing ? "Processing..." : "Approve Developer"}
                  </Button>
                </td>
              </tr>
            ))}
            {pendingDevs.length === 0 && (
              <tr><td colSpan={3} className="p-10 text-center text-slate-500 text-xs">No pending developers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}