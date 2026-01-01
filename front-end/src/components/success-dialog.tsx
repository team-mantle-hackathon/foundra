import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SuccessDialog({ 
  title,
  message, 
  open, 
  onOpenChange 
}: { 
  title: string,
  message: string | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-full text-green-500">
              <AlertCircle size={24} />
            </div>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 font-medium">
            {message || "Success"}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 bg-slate-100 hover:bg-white text-slate-950 font-black uppercase rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}