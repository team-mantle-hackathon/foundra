import { ExternalLink, Github, Send, Twitter } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

export default function FooterLayout(): ReactNode {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between gap-12">
          
          {/* BRAND SECTOR */}
          <div className="space-y-4">
            <img src="/logo.png" alt="Logo Foundra" className="w-44" />
            <p className="text-[12px] text-slate-500 max-w-xs font-bold uppercase tracking-wider">
              Real estate on-chain construction financing.
            </p>
          </div>

          {/* COMMUNITY & RESOURCES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Community</h3>
              <div className="flex flex-col gap-3">
                <a href="https://twitter.com/foundra_web3" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase">
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </a>
                <a href="#" className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase">
                  <Send className="w-3.5 h-3.5" /> Telegram
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resources</h3>
              <div className="flex flex-col gap-3">
                <a href="https://github.com/team-mantle-hackathon/foundra" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase">
                  <Github className="w-3.5 h-3.5" /> Github
                </a>
                <a href="https://foundra-docs.netlify.app" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase">
                  <ExternalLink className="w-3.5 h-3.5" /> Docs
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Navigation</h3>
              <div className="flex flex-col gap-3 text-[11px] font-bold text-slate-500 uppercase">
                <Link to="/vaults" className="hover:text-emerald-400 transition-colors">Vaults</Link>
                <Link to="/developer" className="hover:text-emerald-400 transition-colors">Developer</Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            © 2025 FOUNDRA
          </p>
        </div>

      </div>
    </footer>
  );
}
