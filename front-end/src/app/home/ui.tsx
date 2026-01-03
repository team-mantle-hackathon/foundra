import { Activity, ArrowRight, BrainCircuit, Globe, LineChart, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { VaultCard } from "@/components/vault-card";
import { useListVaultGuest } from "@/hooks/use-list-vault-guest";
import { useSummaryResult } from "@/hooks/use-summary-result";
import { formatUSDC } from "@/lib/utils";

export default function Home(): ReactNode {
  
  const { data: summaryResult, isLoading: isLoadingSummary } = useSummaryResult();
  const { data: listVaultGuest, isLoading: isLoadingListVaultGuest } = useListVaultGuest(3);
  
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-20 space-y-24">
        
        {/* HERO SECTION */}
        <section className="relative grid gap-12 md:grid-cols-[1.2fr,1fr] items-center">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="space-y-8 relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real World Asset • Mantle Network
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                FOUNDRA <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Real Estate On Chain
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
                Structured yield backed by real-world housing projects.
              </p>
            </div>

            {/*<div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 h-12">
                Launch App <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white font-bold px-8 h-12">
                For Project Owner
              </Button>
            </div>*/}
          </div>

          {/* HERO STATS CARD - UPDATED TO PROTOCOL STATS */}
          <div className="grid gap-4 relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl opacity-50" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Status</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Globe className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase">Mantle Testnet</span>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Funded</p>
                {isLoadingSummary ? (
                  <div className="h-10 w-64 rounded-lg bg-slate-800/60 animate-pulse" />
                ) : (
                  <p className="text-4xl font-mono font-bold text-white tracking-tighter">
                    {summaryResult ? formatUSDC(summaryResult.totalFundedRaw) : "0 USDC"}
                  </p>
                )}

              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Active Vaults</p>
                  
                  {isLoadingSummary ? (
                    <div className="h-6 w-10 rounded bg-slate-800/60 animate-pulse" />
                  ) : (
                    <p className="text-xl font-mono font-bold text-emerald-400 text-white">
                      {String(summaryResult?.activeVaults ?? 0).padStart(2, "0")}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Avg. Target APY</p>
                  
                  {isLoadingSummary ? (
                    <div className="h-6 w-14 rounded bg-slate-800/60 animate-pulse" />
                  ) : (
                    <p className="text-xl font-mono font-bold text-cyan-400 uppercase tracking-tighter">
                      {`${Number(summaryResult?.avgTargetApy ?? 0).toFixed(1)}%`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI EXPLAINER */}
        <section className="py-12 border-y border-slate-900">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white">The AI Credit Analyst</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">Our engine replaces rigid bank assessments with real-time scoring of developer cash flows.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: <BrainCircuit className="w-6 h-6" />, title: "Data Ingest", desc: "Location data, RAB, local demand, and developer track record are analyzed." },
              { icon: <LineChart className="w-6 h-6" />, title: "Risk Scoring", desc: "Engine calculates margin sensitivity to output standardized A-C risk grades." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "On-Chain Mint", desc: "Notes are minted as ERC-20 tokens only after meeting risk thresholds." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-slate-900 bg-slate-950/50 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* POOLS PREVIEW */}
        <section className="space-y-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight text-white">Active Vaults</h2>
              <p className="text-sm text-slate-500">Verified construction pools powered by AI risk grading.</p>
            </div>
            <Link to="/vaults" className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center gap-2 border-b border-emerald-400/20 pb-1">
              Browse All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingListVaultGuest ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 animate-pulse">
                  <div className="h-4 w-16 bg-slate-800/70 rounded ml-auto" />
                  <div className="mt-4 h-5 w-3/4 bg-slate-800/70 rounded" />
                  <div className="mt-3 h-3 w-1/2 bg-slate-800/70 rounded" />
                  <div className="mt-6 h-16 bg-slate-800/50 rounded" />
                  <div className="mt-6 h-10 bg-slate-800/70 rounded" />
                </div>
              ))
            ) : (
              (listVaultGuest ?? []).map((v) => (
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
        </section>
      </div>
    </main>
  );
}