import { MapPin, Search } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { VaultCard } from "@/components/vault-card";
import { useListVaultGuest } from "@/hooks/use-list-vault-guest";
import { POOLS } from "../data/pools/warehouse"; // Import data yang baru dibuat di atas

export default function Vault(): ReactNode {
  const navigate = useNavigate();
  
  const { data: vaults, isLoading } = useListVaultGuest(); // all
  const [q, setQ] = useState("");
  
  const filtered = useMemo(() => {
    const list = vaults ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((v) =>
      `${v.project.location} ${v.project.name}`.toLowerCase().includes(s)
    );
  }, [vaults, q]);


  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans tracking-tight">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-l-2 border-emerald-500 pl-6">
          <div className="space-y-4">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.3em]">Institutional Vault</p>
            <h1 className="text-4xl font-black tracking-tight">Real Estate Credit Pools</h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
              List of pools fundings. {isLoading ? "…" : filtered.length} active opportunities available.
            </p>
          </div>

          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input
               value={q}
               onChange={(e) => setQ(e.target.value)}
               placeholder="Search by location..."
               className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600"
             />

          </div>
        </header>

        {/* GRID POOLS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 animate-pulse">
                <div className="h-4 w-16 bg-slate-800/70 rounded ml-auto" />
                <div className="mt-4 h-5 w-3/4 bg-slate-800/70 rounded" />
                <div className="mt-3 h-3 w-1/2 bg-slate-800/70 rounded" />
                <div className="mt-6 h-16 bg-slate-800/50 rounded" />
                <div className="mt-6 h-10 bg-slate-800/70 rounded" />
              </div>
            ))
          ) : (
            filtered.map((v) => (
              <VaultCard
                key={v.id}
                address={v.address_vault}
                name={v.project.name}
                location={v.project.location}
                apy={v.project.target_apy}
                risk={v.project.ai_risk_grade}
                fundsRaw={v.funds}
                targetRaw={v.target_funds}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}