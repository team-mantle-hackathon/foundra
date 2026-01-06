import { Activity, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  progress?: string | null;
  txHash?: string | null;
  explorerTxUrl?: string | null;
  canClose?: boolean;
};

export function ProgressDialog({
  open,
  onOpenChange,
  title,
  description,
  progress,
  txHash,
  explorerTxUrl,
  canClose = true,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={canClose ? onOpenChange : () => {}}>
      <DialogContent className="sm:max-w-130 bg-slate-900 border-slate-800 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-slate-400 text-xs">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-300 font-mono">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>{progress ?? "Working..."}</span>
          </div>

          {txHash ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Tx Hash
              </p>
              <p className="mt-1 text-xs font-mono break-all text-slate-200">
                {txHash}
              </p>

              {explorerTxUrl ? (
                <Button
                  variant="secondary"
                  className="mt-3 bg-slate-800 hover:bg-slate-900 text-white"
                  onClick={() => window.open(explorerTxUrl, "_blank")}
                >
                  Open Explorer <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            className="bg-slate-800 hover:bg-slate-900 text-white"
            onClick={() => onOpenChange(false)}
            disabled={!canClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
