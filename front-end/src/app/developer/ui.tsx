import { motion } from "framer-motion";
import { BarChart3, FileCode, ShieldCheck, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function Developer(): ReactNode {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans tracking-tight">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 space-y-12">
        
        {/* HERO SECTION */}
        <header className="space-y-4 border-l-2 border-emerald-500 pl-6">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
            Asset Origination Protocol
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase max-w-2xl leading-none">
            Scale your Real Estate projects with <span className="text-emerald-500">Global Liquidity.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-3xl font-medium leading-relaxed">
            FOUNDRA bypasses traditional banking hurdles. We provide construction 
            financing based on project viability, market demand, and AI-driven cash flow analysis. 
            No more stalled projects—just on-chain efficiency.
          </p>
        </header>

        {/* GUIDELINES GRID */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* STEP 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-100">1. Funding Criteria</h3>
              <ul className="text-[11px] text-slate-400 space-y-2 font-bold uppercase tracking-tight">
                <li className="flex items-start gap-2">• <span className="text-slate-200">Residential Clusters (10-100 Units)</span></li>
                <li className="flex items-start gap-2">• <span className="text-slate-200">Verified Land Titles</span></li>
                <li className="flex items-start gap-2">• <span className="text-slate-200">Clear Exit Strategy & Margins</span></li>
              </ul>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <FileCode className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-100">2. Required Data</h3>
              <ul className="text-[11px] text-slate-400 space-y-2 font-bold uppercase tracking-tight">
                <li className="flex items-start gap-2">• <span className="text-slate-200">Siteplan & Geolocation</span></li>
                <li className="flex items-start gap-2">• <span className="text-slate-200">Estimated Construction Costs</span></li>
                <li className="flex items-start gap-2">• <span className="text-slate-200">Unit Pricing & Sales Target</span></li>
              </ul>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-100">3. Underwriting</h3>
              <ul className="text-[11px] text-slate-400 space-y-2 font-bold uppercase tracking-tight">
                <li className="flex items-start gap-2">• <span className="text-slate-200">Automated AI Risk Scoring</span></li>
                <li className="flex items-start gap-2">• <span className="text-slate-200">On-chain Proof of Legality</span></li>
                <li className="flex items-start gap-2">• <span className="text-slate-200">Smart Contract Pool Launch</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="w-32 h-32 text-emerald-400" />
          </div>
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-lg md:text-xl font-black text-slate-100 uppercase tracking-tighter">
              Ready to Tokenize Your Pipeline?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl font-medium leading-relaxed">
              Experience the hackathon demo flow. Once your identity is verified via 
              <span className="text-emerald-400 font-bold ml-1">Reclaim zk-TLS</span>, 
              you can submit project details and generate an instant AI Risk Grade.
            </p>
          </div>

          <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black h-14 px-10 text-xs tracking-widest transition-all active:scale-95 uppercase relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Submit Project (Demo)
          </Button>
        </section>

      </div>
    </main>
  );
}