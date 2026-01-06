import { DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatUSDC } from "@/lib/utils"; // <- pake punyamu

type QuickInvestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pool: {
    id: string;
    name: string;
    apy: number;
    status_vault: string;
    target_funds: bigint; // RAW micro USDC
  };
  disabled?: boolean;
  onConfirm: (amount: number) => void; // amount in USDC (normal)
};

export function QuickInvestDialog({
  open,
  onOpenChange,
  pool,
  disabled = false,
  onConfirm,
}: QuickInvestDialogProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // max in normal USDC (number)
  const maxUSDC = useMemo(() => Number(pool.target_funds) / 1_000_000, [pool.target_funds]);

  // label buat UI (pake formatUSDC)
  const maxLabel = useMemo(() => formatUSDC(pool.target_funds), [pool.target_funds]);

  useEffect(() => {
    if (!open) {
      setAmount("");
      setError("");
    }
  }, [open]);

  const disabledBtn =
    pool.status_vault !== "FUNDRAISING" ||
    !amount ||
    Number(amount) <= 0 ||
    !!error;

  const onChangeAmount = (v: string) => {
    setAmount(v);

    if (!v) {
      setError("");
      return;
    }

    const n = Number(v);
    if (!Number.isFinite(n)) {
      setError("Invalid amount");
      return;
    }
    if (n <= 0) {
      setError("Amount must be > 0");
      return;
    }
    if (n > maxUSDC) {
      setError(`Max ${maxLabel}`);
      return;
    }

    setError("");
  };

  const onMax = () => {
    // isi input pakai angka USDC normal
    // toFixed(2) biar rapih, tapi gak maksa; silakan 2 decimal aja
    setAmount(maxUSDC.toFixed(0));
    setError("");
  };

  const confirm = () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;

    // safety clamp
    const safe = Math.min(n, maxUSDC);
    onConfirm(safe);
  };

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
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Investment Amount (USDC)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono">
                  Max: {maxLabel}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 border-slate-800 bg-slate-900 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest"
                  onClick={onMax}
                >
                  Max
                </Button>
              </div>
            </div>

            <Input
              type="text"
              placeholder="1000"
              value={amount}
              onChange={(e) => onChangeAmount(e.target.value)}
              className="bg-slate-900 border-slate-800 text-white"
            />

            {error && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {error}
              </p>
            )}
          </div>

          <Button
            disabled={disabled || disabledBtn}
            onClick={confirm}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest h-11"
          >
            Confirm Investment <DollarSign className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
