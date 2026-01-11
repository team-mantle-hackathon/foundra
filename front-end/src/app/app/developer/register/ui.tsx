import { zodResolver } from "@hookform/resolvers/zod";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { Activity, BadgeCheck, Building2, CheckCircle2, FileText, Loader2, ShieldCheck, Upload } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as z from "zod";
import { ErrorDialog } from "@/components/error-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterProjectOwner } from "@/hooks/use-register-project-owner";

const formSchema = z.object({
  name: z.string().min(2, "Name minimal 2 characters"),
  documentIdentity: z
      .instanceof(FileList)
      .refine((file) => !!file, "Document Identity File Required")
      .refine((file) => file && file[0].size <= 5 * 1024 * 1024, "Maximal file size 5MB")
      .refine(
        (file) => file && ["application/pdf", "image/jpeg", "image/png"].includes(file[0].type),
        "Only PDF or Image"
      ),
  companyName: z.string().min(3, "Company name minimal 3 characters"),
  regNumber: z.string().min(5, "Registration number not valid"),
  licenseFile: z
      .instanceof(FileList)
      .refine((file) => !!file, "Business License File required")
      .refine((file) => file && file[0].size <= 5 * 1024 * 1024, "Maximal file size 5MB")
      .refine(
        (file) => file && ["application/pdf", "image/jpeg", "image/png"].includes(file[0].type),
        "Only PDF or Image"
      ),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterDeveloper(): ReactNode {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const { mutate: registerOrg, isPending } = useRegisterProjectOwner(setProgress);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { companyName: "", regNumber: "", licenseFile: undefined }
  });

  const licenseFileValue = watch("licenseFile");
  const documentIdentityValue = watch("documentIdentity");
  
  const onDrop = (input: any, e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) {
      setValue(input, files, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    const file = data.licenseFile?.[0];
    const documentIdentity = data.documentIdentity?.[0];
    
    const payload: any = {
      ...data,
      documentIdentity,
      file
    }
    
    if (!file) {
      setErrorMessage("Please upload your business license first.");
      setIsErrorOpen(true);
      return;
    }

    console.log("File ready to upload:", file.name);
    
    registerOrg(payload, {
      onSuccess: () => navigate("/app/developer"),
      onError: (err) => {
        setErrorMessage(err.message || "Something went wrong on-chain or database.");
        setIsErrorOpen(true);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <main className="pt-24 pb-20 px-6 flex justify-center">
        <Card className="w-full max-w-xl bg-slate-900/40 border-slate-800 p-8 space-y-8 backdrop-blur-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white italic">Organization Registry</h1>
            <p className="text-sm text-slate-400 font-medium">Verified identity & on-chain document storage.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <Input 
                    {...register("name")}
                    placeholder="e.g. Jhon Doe" 
                    className={`bg-slate-950 border-slate-800 pl-10 text-white focus:border-emerald-500 ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Document Identity</Label>
                <div className="relative group">
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={(e) => onDrop('documentIdentity', e)} 
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${documentIdentityValue && documentIdentityValue.length > 0 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {documentIdentityValue && documentIdentityValue.length > 0 ? <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" /> : 
                        <Upload className="w-8 h-8 text-slate-600 mb-2 group-hover:text-slate-400" />}
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                        {documentIdentityValue && documentIdentityValue.length > 0 ? (documentIdentityValue as unknown as FileList)?.[0]?.name : "Upload File"}
                      </p>
                    </div>
                    <input type="file" className="hidden" {...register('documentIdentity')} />
                  </div>
                  {errors.documentIdentity && (
                    <p className="text-[10px] text-red-500 font-bold uppercase pt-2">{errors.documentIdentity.message as string}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <Input 
                    {...register("companyName")}
                    placeholder="e.g. Global Realty Ltd" 
                    className={`bg-slate-950 border-slate-800 pl-10 text-white focus:border-emerald-500 ${errors.companyName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.companyName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.companyName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Registration Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <Input 
                    {...register("regNumber")}
                    placeholder="Business ID / Tax Number" 
                    className={`bg-slate-950 border-slate-800 pl-10 text-white focus:border-emerald-500 ${errors.regNumber ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.regNumber && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.regNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Business License</Label>
                <div className="relative group">
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={(e) => onDrop('licenseFile', e)} 
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${licenseFileValue && licenseFileValue.length > 0 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {licenseFileValue && licenseFileValue.length > 0 ? <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" /> : 
                       <Upload className="w-8 h-8 text-slate-600 mb-2 group-hover:text-slate-400" />}
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                        {licenseFileValue && licenseFileValue.length > 0 ? (licenseFileValue as unknown as FileList)?.[0]?.name : "Upload File"}
                      </p>
                    </div>
                    <input type="file" className="hidden" {...register('licenseFile')} />
                  </div>
                  {errors.licenseFile && (
                    <p className="text-[10px] text-red-500 font-bold uppercase pt-2">{errors.licenseFile.message as string}</p>
                  )}
                </div>
              </div>
            </div>
            {isPending && progress && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-400 font-mono mb-4">
                <Activity className="w-3 h-3 animate-pulse" />
                {progress}
              </div>
            )}
            <Button 
              type="submit"
              disabled={!isValid || isPending}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-7 rounded-xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-30"
            >
              {isPending ? <Loader2 className="animate-spin mr-2" /> : "Complete Registration"}
            </Button>
          </form>
        </Card>
      </main>
      <ErrorDialog
        title="Registration Failed"
        error={errorMessage} 
        open={isErrorOpen} 
        onOpenChange={setIsErrorOpen} 
      />
    </div>
  );
}