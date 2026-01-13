import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LogOut, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDisconnect } from "wagmi";
import { Button } from "../ui/button";

export default function HeaderDashboard(): ReactNode {
  const { disconnectAsync } = useDisconnect();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("user_role");

  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("user_role");
      await disconnectAsync();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="px-6 py-4 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          {/*<div className="text-lg font-black tracking-tighter text-slate-100 uppercase italic flex items-center gap-2">
            <div className="w-2 h-6 bg-emerald-500 rounded-full group-hover:scale-y-125 transition-transform" />
            FOUNDRA
          </div>*/}
          <img src={'/logo.png'} width={150} alt="Logo Foundra" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          {userRole === "admin" && (
            <>
              <Link to="/app/admin" className="nav-link">Dashboard</Link>
              <Link to="/app/admin/projects" className="nav-link">Projects</Link>
              <Link to="/app/admin/developers" className="nav-link">Project Owners</Link>
              <Link to="/app/admin/investors" className="nav-link">Investors</Link>
            </>
          )}

          {userRole === "developer" && (
            <>
            <Link to="/app/developer" className="nav-link">Dashboard</Link>
            <Link to="/app/developer" className="nav-link">
              My Projects
            </Link>
            </>
          )}

          {userRole === "investor" && (
            <>
            <Link to="/app/investor" className="nav-link">Dashboard</Link>
            <Link to="/app/investor" className="nav-link">
              Positions
            </Link>
            </>
          )}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="md:flex hidden lg:max-w-full">
            <ConnectButton.Custom>
              {({
                account,
                openConnectModal,
                mounted,
              }) => {
                if (!mounted) return null;
            
                if (!account) {
                  return (
                    <Button type="button" className="w-full" onClick={openConnectModal}>
                      Connect Wallet
                    </Button>
                  );
                }
            
                return (
                  <Button type="button" className="md:max-w-lg w-full bg-emerald-600 hover:bg-emerald-800 text-white">
                    {account.displayName}
                  </Button>
                );
              }}
            </ConnectButton.Custom>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 border-l border-white/10 pl-4"
          >
            <LogOut size={14} /> Sign Out
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md border border-white/10 text-slate-300"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/95 px-6 py-4 space-y-3">
          {userRole === "admin" && (
            <>
              <Link onClick={() => setOpen(false)} to="/app/admin/projects" className="mobile-link">
                Projects
              </Link>
              <Link onClick={() => setOpen(false)} to="/app/admin/owners" className="mobile-link">
                Project Owners
              </Link>
              <Link onClick={() => setOpen(false)} to="/app/admin/investors" className="mobile-link">
                Investors
              </Link>
            </>
          )}

          {userRole === "project-owner" && (
            <Link onClick={() => setOpen(false)} to="/app/developer" className="mobile-link">
              My Projects
            </Link>
          )}

          {userRole === "investor" && (
            <Link onClick={() => setOpen(false)} to="/app/investor" className="mobile-link">
              Positions
            </Link>
          )}
          
          <div className="md:hidden flex flex-col border-t border-white/10 pt-3 mt-3">
            <ConnectButton.Custom>
              {({
                account,
                openConnectModal,
                mounted,
              }) => {
                if (!mounted) return null;
            
                if (!account) {
                  return (
                    <Button type="button" className="w-full" onClick={openConnectModal}>
                      Connect Wallet
                    </Button>
                  );
                }
            
                return (
                  <Button type="button" className="md:max-w-lg w-full bg-emerald-600 hover:bg-emerald-800 text-white">
                    {account.displayName}
                  </Button>
                );
              }}
            </ConnectButton.Custom>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 pt-3 mt-3 text-[11px] font-black uppercase tracking-widest text-red-400"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
