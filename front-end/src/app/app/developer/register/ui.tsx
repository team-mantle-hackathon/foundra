import { zodResolver } from "@hookform/resolvers/zod";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { BadgeCheck, Building2, CheckCircle2, FileText, Loader2, ShieldCheck, Upload } from "lucide-react";
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

// 1. DEFINISI SCHEMA VALIDASI
const formSchema = z.object({
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
  const { mutate: registerOrg, isPending } = useRegisterProjectOwner();
  
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
  
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) {
      setValue("licenseFile", files, { shouldValidate: true });
    }
  };

  // const startReclaimVerification = async () => {
  //   setLoading(true);
  //   try {
  //     const reclaimProofRequest = await ReclaimProofRequest.init("APP_ID", "SECRET", "PROVIDER");
  //     const requestUrl = await reclaimProofRequest.getRequestUrl();
  //     window.open(requestUrl, "_blank");
  //     await reclaimProofRequest.startSession({
  //       onSuccess: () => { setIsVerified(true); setLoading(false); },
  //       onError: () => setLoading(false)
  //     });
  //   } catch (error) { setLoading(false); }
  // };
  // 

  const onSubmit = async (data: FormData) => {
    const file = data.licenseFile?.[0];
    
    const payload: any = {
      ...data,
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
                    onDrop={onDrop} 
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

            {/*<div className={`p-6 rounded-2xl border transition-all ${isVerified ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/50'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <ShieldCheck className={isVerified ? 'text-emerald-400' : 'text-slate-500'} size={18} />
                  ZK-TLS Identity
                </h3>
                {isVerified && <BadgeCheck className="text-emerald-400" />}
              </div>
              <Button type="button" onClick={startReclaimVerification} disabled={loading || isVerified} className="w-full bg-slate-100 hover:bg-white text-slate-950 font-black uppercase text-[10px]">
                {loading ? <Loader2 className="animate-spin mr-2" /> : isVerified ? "Verified" : "Verify Identity"}
              </Button>
            </div>*/}

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