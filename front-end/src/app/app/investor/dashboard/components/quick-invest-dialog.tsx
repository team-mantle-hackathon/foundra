import { DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type QuickInvestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pool: {
    id: string;
    name: string;
    apy: number;
    status_vault: string;
  };
  disabled?: boolean;
  onConfirm: (amount: number) => void;
};

export function QuickInvestDialog({
  open,
  onOpenChange,
  pool,
  disabled = false,
  onConfirm,
}: QuickInvestDialogProps) {
  const [amount, setAmount] = useState("");

  const disabledBtn =
    pool.status_vault !== "FUNDRAISING" || !amount || Number(amount) <= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Invest in {pool.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Target APY
            </p>
            <p className="text-2xl font-mono font-bold text-emerald-400">
              {pool.apy}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Investment Amount (USDC)
            </label>
            <Input
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-900 border-slate-800 text-white"
            />
          </div>

          <Button
            disabled={disabled || disabledBtn}
            onClick={() => onConfirm(Number(amount))}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest h-11"
          >
            Confirm Investment <DollarSign className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
