import {
  Activity,
  Clock,
  DollarSign,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVaultDetail } from "@/hooks/use-vault-detail";
import { SkeletonDetail } from "./components/skeleton-detail";

export default function VaultDetailInvestor() {
  const { address } = useParams<{ address: string }>();
  const { data: pool, isLoading } = useVaultDetail(address!);
  const [amount, setAmount] = useState("");

  if (isLoading) return <SkeletonDetail />;
  if (!pool) return null;

  const disabled =
    pool.status_vault !== "FUNDRAISING" ||
    !amount ||
    Number(amount) <= 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 pt-36 pb-20">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1fr,380px] items-start">

        {/* LEFT – CONTENT */}
        <section className="space-y-8">
          {/* HEADER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 break-all">
                {address}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              {pool.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              {pool.location}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Project Overview
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {pool.description}
            </p>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-3 gap-4">
            <Metric
              label="Target APY"
              value={`${pool.apy}%`}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <Metric
              label="Tenor"
              value={pool.tenor}
              icon={<Clock className="w-4 h-4" />}
            />
            <Metric
              label="Risk Grade"
              value={`Grade ${pool.risk}`}
              icon={<ShieldCheck className="w-4 h-4" />}
            />
          </div>

          {/* TRUST SIGNAL */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                AI Risk Assessment
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {[
                "Milestone-based fund disbursement",
                "Legal asset verification completed",
                "On-chain settlement enforced",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT – INVEST BOX */}
        <aside className="sticky top-24">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-2xl ring-1 ring-emerald-500/10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Fixed Yield
              </p>
              <p className="text-4xl font-bold text-emerald-400 font-mono tracking-tight">
                {pool.apy}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Tenor" value={pool.tenor} />
              <MiniStat label="Min. Invest" value="100 USDC" />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <Input
                type="number"
                placeholder="Enter amount (USDC)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-950 border-slate-800 h-11 text-sm font-bold text-emerald-400 placeholder:text-slate-700"
              />

              <Button
                disabled={disabled}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-black h-12 uppercase tracking-[0.15em] transition-all"
                onClick={() =>
                  console.log("INVEST", amount, "TO", pool.id)
                }
              >
                Invest Now <DollarSign className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-[10px] text-slate-500 text-center">
                Funds are locked until project completion
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ====== SMALL COMPONENTS ====== */

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-center gap-2 text-xl font-mono font-bold text-emerald-400">
        {icon}
        {value}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 text-center">
      <p className="text-[9px] uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="text-xs font-bold text-slate-200">{value}</p>
    </div>
  );
}
