import { Check, FileText, UploadCloud } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";

export function DocumentUploadButton({ 
  label, 
  onFileSelect 
}: { 
  label: string; 
  onFileSelect?: (file: File) => void;
}): ReactNode {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    onFileSelect?.(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}

      // 👇 drag handlers
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}

      className={`flex items-center justify-between p-2.5 rounded-xl border border-dashed transition-all cursor-pointer group
        ${fileName
          ? "border-emerald-500 bg-emerald-500/10"
          : isDragging
            ? "border-emerald-400 bg-emerald-500/10"
            : "border-slate-700 bg-slate-950/30 hover:border-emerald-500/50 hover:bg-emerald-500/5"
        }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="flex items-center gap-2 overflow-hidden">
        {fileName ? (
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        ) : (
          <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
        )}
        <span className={`text-[10px] truncate font-medium ${
          fileName ? "text-emerald-300" : "text-slate-400 group-hover:text-slate-200"
        }`}>
          {fileName ?? label}
        </span>
      </div>

      {!fileName && (
        <UploadCloud className="w-3 h-3 text-slate-600 group-hover:text-emerald-500" />
      )}
    </div>
  );
}
