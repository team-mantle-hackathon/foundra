import { MapPin, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { POOLS } from "../data/pools/warehouse"; // Import data yang baru dibuat di atas

export default function Vault(): ReactNode {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans tracking-tight">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-l-2 border-emerald-500 pl-6">
          <div className="space-y-4">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.3em]">Institutional RWA</p>
            <h1 className="text-4xl font-black tracking-tight">Real Estate Credit Pools</h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
              List of pools fundings. {POOLS.length} active opportunities available.
            </p>
          </div>

          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input 
               placeholder="Search by location..." 
               className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600"
             />
          </div>
        </header>

        {/* GRID POOLS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {POOLS.map((pool) => {
            const progress = (pool.raisedAmount / pool.targetAmount) * 100;
            
            // Logic Warna Grade Only
            const gradeColor = pool.risk === 'A' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : pool.risk === 'B' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20';

            return (
              <div key={pool.txHash} className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:bg-slate-900/60 transition-all duration-300">
                
                <div className="space-y-4">
                  {/* Grade Only - Pojok Kanan */}
                  <div className="flex justify-end">
                    <span className={`text-[10px] font-black px-2 py-1 rounded border ${gradeColor}`}>
                      Grade {pool.risk}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {pool.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 mt-2">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{pool.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-800/50">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Yield</p>
                      <p className="text-lg font-black text-emerald-400">{pool.apy}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Target</p>
                      <p className="text-xs font-bold text-slate-200">
                        {pool.targetRaise.replace(" USDC", "")} <span className="text-[9px] text-slate-500">USDC</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                      <span className="text-slate-400">Filled</span>
                      <span className="text-emerald-400">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6 bg-slate-100 hover:bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] h-10 transition-transform active:scale-[0.98]"
                  onClick={() => navigate(`/vaults/${pool.txHash}`)} 
                >
                  Analyze Assets
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}