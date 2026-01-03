import { Button } from "@/components/ui/button";
import {
  useApproveDeveloper,
  useDeveloperVerificationList,
} from "@/hooks/use-developer-verification";

export default function AdminDeveloper() {
  const { devs, isLoading, error, refresh } = useDeveloperVerificationList();

  const { approve, syncingWallet } = useApproveDeveloper({
    registryAddress: import.meta.env.VITE_PROTOCOL_REGISTRY_ADDRESS,
    requireZkVerified: true
  });

  if (isLoading) return <div className="p-8 text-white">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="pt-24 px-8 bg-slate-950 min-h-screen text-white">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left w-[60px]">No</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Wallet</th>
              <th className="px-6 py-4 text-left">ZK-KYC</th>
              <th className="px-6 py-4 text-left">Manual KYC</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {devs.map((dev, idx) => {
              const fullyApproved = dev.zk_verified && dev.manual_verified;
              const isRowSyncing = syncingWallet === dev.wallet_address;

              return (
                <tr key={dev.id} className="hover:bg-white/2">
                  <td className="px-6 py-4 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-xs">
                    {dev.name || "(no name)"}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {dev.wallet_address}
                  </td>

                  <td className="px-6 py-4 text-xs">
                    {dev.zk_verified ? "Verified" : "Not Verified"}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {dev.manual_verified ? "Approved" : "Pending"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Button
                      disabled={fullyApproved || isRowSyncing}
                      onClick={async () => {
                        const res = await approve(dev);
                        if (res.ok) {
                          alert("SUCCESS: Approved!");
                          refresh();
                        } else {
                          alert(`FAILED: ${res.reason}`);
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black uppercase px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {fullyApproved
                        ? "Already Approved"
                        : isRowSyncing
                        ? "Processing..."
                        : "Approve Developer"}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {devs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-500 text-xs">
                  No developers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
