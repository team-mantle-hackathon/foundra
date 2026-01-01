import type { ReactNode } from "react";

export function SummaryCard({ label, value, sub, icon }: { label: string; value: string | number; sub: string; icon: ReactNode }): ReactNode {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 backdrop-blur-md hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{label}</p>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight text-slate-100">{value}</p>
        <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
      </div>
    </div>
  );
}