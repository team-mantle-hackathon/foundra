// src/components/vault/VaultCardGuest.tsx
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { formatUSDC } from "@/lib/utils";

type Props = {
  address: string;
  name: string;
  location: string;
  apy: number;
  risk: string;
  fundsRaw: number;
  targetRaw: number;
};

export function VaultCard({
  address,
  name,
  location,
  apy,
  risk,
  fundsRaw,
  targetRaw,
}: Props) {
  const navigate = useNavigate();
  const progress = targetRaw > 0 ? Math.min(100, (fundsRaw / targetRaw) * 100) : 0;

  const gradeColor =
    risk === "A"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : risk === "B"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:bg-slate-900/60 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex justify-end">
          <span className={`text-[10px] font-black px-2 py-1 rounded border ${gradeColor}`}>
            Grade {risk}
          </span>
        </div>

        <div>
          <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-500 mt-2">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-800/50">
          <div>
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Yield</p>
            <p className="text-lg font-black text-emerald-400">{apy.toFixed(1)}%</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Target</p>
            <p className="text-xs font-bold text-slate-200">
              {formatUSDC(targetRaw).replace(" USDC", "")}{" "}
              <span className="text-[9px] text-slate-500">USDC</span>
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
        className="w-full mt-6 bg-slate-100 hover:bg-slate-300 cursor-pointer text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] h-10 transition-transform active:scale-[0.98]"
        onClick={() => navigate(`/vaults/${address}`)}
      >
        Analyze Assets
      </Button>
    </div>
  );
}
