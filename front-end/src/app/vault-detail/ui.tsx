import { motion } from "framer-motion";
import { ArrowLeft, Globe, Info, ShieldCheck, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVaultDetailGuest } from "@/hooks/use-vault-detail-guest";
import { formatUSDC } from "@/lib/utils";

export default function VaultDetail(): ReactNode {
  const navigate = useNavigate();
  const { address } = useParams();

  const { data: vault, isLoading, isError } = useVaultDetailGuest(address);

  // MINIMAL GUARD (biar gak undefined)
  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-950 text-slate-50 font-sans tracking-tight">
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6">
          <div className="h-4 w-24 bg-slate-800/70 rounded animate-pulse" />
          <div className="h-10 w-2/3 bg-slate-800/70 rounded animate-pulse" />
          <div className="grid gap-6 md:grid-cols-[1fr,320px]">
            <div className="h-56 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse" />
            <div className="h-80 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !vault) {
    return (
      <section className="min-h-screen bg-slate-950 text-slate-50 font-sans tracking-tight">
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-[10px] text-slate-500 hover:text-emerald-400 font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          <p className="text-slate-400 text-sm">Vault not found / failed to load.</p>
        </div>
      </section>
    );
  }

  const progress =
    vault.targetRaw === 0n ? 0 : Number((vault.fundsRaw * 100n) / vault.targetRaw);

  const liquidityLabel = vault.project.riskGrade === "A" ? "low" : "moderate";

  return (
    <section className="min-h-screen bg-slate-950 text-slate-50 font-sans tracking-tight">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6"
      >
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] text-slate-500 hover:text-emerald-400 font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* HEADER */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-l-2 border-emerald-500 pl-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-emerald-500/20">
                Mantle Network
              </span>

              <a
                href={`https://sepolia.mantlescan.xyz/address/${vault.addressVault}`}
                target="_blank"
                rel="noreferrer"
                className="text-[9px] text-slate-500 hover:text-emerald-400 font-mono tracking-tight"
              >
                VAULT: {vault.addressVault}
              </a>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
              {vault.project.name}
            </h1>

            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium font-mono">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> {vault.project.location}
              </span>
            </div>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">
              Risk Assessment
            </p>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400 uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              Grade {vault.project.riskGrade}
            </span>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr,320px] items-start">
          <div className="space-y-6">
            {/* DESCRIPTION */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3 shadow-inner"
            >
              <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
                <Info className="w-4 h-4 text-emerald-400" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  Project Overview
                </h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-normal antialiased">
                {vault.project.description}
              </p>
            </motion.section>

            {/* AI AUDIT */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  AI Risk Audit
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter italic font-mono">
                    Neural Engine Output
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "Asset verification complete. milestone-based disbursement active. Liquidity risk weighted at{" "}
                    {liquidityLabel} based on {vault.project.location} market depth."
                  </p>

                  <p className="text-sm text-slate-500 font-mono">
                    Score:{" "}
                    <span className="text-slate-300 font-bold">{vault.project.riskScore}</span>
                  </p>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 flex flex-col justify-center">
                  <ul className="space-y-2">
                    {["Milestone-based Funding", "Legal Title Verified", "On-chain Settlement"].map(
                      (item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-tight"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-500" /> {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </motion.section>
          </div>

          {/* INVEST BOX */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-2xl ring-1 ring-emerald-500/5">
              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                  Fixed Yield
                </p>
                <div className="text-4xl font-bold text-emerald-400 font-mono tracking-tighter">
                  {vault.project.targetApy.toFixed(1)}%
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-end text-[10px] font-bold uppercase">
                  <span className="text-slate-500 tracking-widest font-mono">Fundraised</span>
                  <span className="text-emerald-400 font-mono">{progress}%</span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-medium text-white font-mono">
                  <span>{formatUSDC(vault.fundsRaw)}</span>
                  <span>/ {formatUSDC(vault.targetRaw)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <p className="text-[8px] text-slate-500 font-bold uppercase mb-0.5">Tenor</p>
                  <p className="text-xs font-bold text-slate-200 uppercase">
                    {vault.tenorMonths} months
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-[8px] text-slate-500 font-bold uppercase mb-0.5">Min. Inv</p>
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-tighter">
                    6.5 USDC
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/app")}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-12 text-xs tracking-[0.15em] transition-all uppercase shadow-[0_0_20px_rgba(16,185,129,0.1)] active:scale-95"
                >
                  Launch App
                </Button>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}
