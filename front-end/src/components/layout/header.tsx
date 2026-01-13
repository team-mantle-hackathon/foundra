import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, NavLink } from "react-router";
import { Button } from "../ui/button";

const NavItems = ({ onClick }: { onClick?: () => void }) => (
  <>
    {["Vaults", "Project Owner"].map((item) => (
      <NavLink
        key={item}
        to={item === "Vaults" ? "/vaults" : "/developer"}
        onClick={onClick}
        className={({ isActive }) =>
          `transition-all duration-300 uppercase tracking-widest md:text-[11px] text-lg font-black ${
            isActive
              ? "text-emerald-400 md:border-b-2 md:border-emerald-400 pb-1"
              : "text-slate-500 hover:text-emerald-400"
          }`
        }
      >
        {item}
      </NavLink>
    ))}
  </>
);

export default function HeaderLayout(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link to={"/"} className="group" onClick={() => setIsOpen(false)}>
          {/*<div className="text-lg font-black tracking-tighter text-slate-100 uppercase italic flex items-center gap-2">
            <div className="w-2 h-6 bg-emerald-500 rounded-full group-hover:scale-y-125 transition-transform" />
            FOUNDRA
          </div>*/}
          <img src={'/logo.png'} width={150} alt="Logo Foundra" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 font-black">
          <NavItems />
        </nav>

        <div className="flex items-center gap-4">
          <Link to={"/app"} className="hidden md:block">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 uppercase tracking-widest">
              Launch App
            </Button>
          </Link>

          <button className="md:hidden text-slate-100 p-2 z-[101]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY WITH MOTION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[90] bg-slate-950 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              <NavItems onClick={() => setIsOpen(false)} />
            </nav>
            <Link to={"/app"} onClick={() => setIsOpen(false)}>
              <Button className="bg-emerald-500 text-slate-950 font-black px-10 py-7 rounded-2xl uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                Launch App
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}