import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (reason: string) => void;
  disabled?: boolean;
};

export function RejectReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  disabled,
}: Props) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 bg-slate-900 border-slate-800 text-slate-50">
        <DialogHeader>
          <DialogTitle>Reject Project</DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Input the reason for rejecting project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Example: Location fake / Document is not completed / False document of budget plan"
            cols={30}
            rows={10}
            className="min-h-30 bg-slate-950 border-slate-800 text-sm focus:ring-red-500/40"
          />
          <p className="text-[12px] text-slate-500">
            Keep it specific.
          </p>
        </div>

        <DialogFooter>
          <Button
            className="bg-slate-800 hover:bg-slate-900 text-white cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={disabled}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-slate-950 font-bold cursor-pointer"
            onClick={() => onConfirm(reason.trim())}
            disabled={disabled || reason.trim().length < 3}
          >
            Confirm Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
