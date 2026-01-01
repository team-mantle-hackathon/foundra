import { zodResolver } from "@hookform/resolvers/zod";
import {
	Activity,
	CheckCircle2,
	ExternalLink,
	Plus,
	ShieldCheck,
	TrendingDown,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { DocumentUploadButton } from "@/components/document-button";
import { ErrorDialog } from "@/components/error-dialog";
import { SuccessDialog } from "@/components/success-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/hooks/use-projects";
import { useRepay } from "@/hooks/use-repay";
import { useSubmitProject } from "@/hooks/use-submit-project";
import { formatUSDC } from "@/lib/utils";
import { QuickRepayDialog } from "./components/quick-repay-dialog";
import { SummaryCard } from "./components/summary-card";

const projectSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	location: z.string().min(1, "Location is required"),
	description: z.string().min(1, "Description is required"),
	estimated_budget: z.coerce.number().min(1, "Budget must be at least 100 USDC"),
	target: z.coerce.number().min(1, "Target must be at least 100 USDC"),
	estimated_durations: z.coerce.number().min(1, "Duration is required"),
	land_certificate: z.instanceof(File, { message: "Land certificate is required" }),
	building_permit: z.instanceof(File, { message: "Building permit is required" }),
	site_plan: z.instanceof(File, { message: "Site plan is required" }),
	budget_plan: z.instanceof(File, { message: "Budget plan is required" }),
	target_apy: z
  .coerce
  .number("Target APY is required")
  .min(0.1, "Target APY must be at least 0.1%")
  .max(30, "Target APY too high for real estate projects")
});

export default function DeveloperDashboard(): ReactNode {
	const [isOpen, setIsOpen]             = useState<boolean>(false);
  const [isSuccess, setIsSuccess]       = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isError, setIsError]           = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress]         = useState<string | null>(null);
  const [repayOpen, setRepayOpen]       = useState<boolean>(false);
  const [selectedPool, setSelectedPool] = useState<any>({})
	
  const { mutate, isPending } = useSubmitProject(setProgress);
  const { data: projects, isLoading } = useProjects();
  const { mutate: repay, isPending: isPendingRepay } = useRepay();
	
	const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
		resolver: zodResolver(projectSchema),
		defaultValues: {
      name: "",
      location: "",
      estimated_budget: 0,
      target: 0,
      estimated_durations: 0,
      target_apy: 0
    }
	});
	
	const totalCapitalReceived = projects?.reduce((acc, p) => {
    const funds = p.vaults?.[0]?.funds ?? 0;
    return acc + BigInt(funds);
  }, 0n) ?? 0n;
	
	const totalOwed = projects?.reduce((acc, p) => {
    const funds = p.vaults?.[0]?.outstanding ?? 0;
    return acc + BigInt(funds);
  }, 0n) ?? 0n;
	
	const onSubmit = (data: any) => {
	  mutate(data, {
			onSuccess: () => {
			  setProgress(null)
        reset()
			  setIsOpen(false)
				setSuccessMessage('Success Submitting Project')
				setIsSuccess(true)
			},
			onError: (error) => {
			  setProgress(null)
			  setIsOpen(false)
				setErrorMessage(error.message || "Something went wrong on-chain or database.");
        setIsError(true);
			}
		})
	};

	const getStatusStyle = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
			// case "Construction":
			// 	return "text-amber-400 bg-amber-500/10 border-amber-500/20";
			case "COMPLETED":
				return "text-purple-400 bg-purple-500/10 border-purple-500/20";
			case "REJECTED":
				return "text-red-400 bg-red-500/10 border-red-500/20";
			default:
				return "text-slate-400 bg-slate-500/10 border-slate-500/20";
		}
	};
	
	const onRepay = async({id, address, amount}: {id: string, address: `0x${string}`, amount: bigint}): Promise<void> => {
    repay({id, vaultAddress:address, amount}, {
      onSuccess: () => {
        setRepayOpen(false)
        setSuccessMessage('Success Repay')
        setIsSuccess(true)
      },
      onError: (error) => {
        setRepayOpen(false)
        setIsError(true)
        setErrorMessage(error.message)
      }
    })
	}

	return (
		<main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
			<div className="max-w-7xl mx-auto px-4 pt-24 pb-16 space-y-8">
				<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800 pb-8">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<ShieldCheck className="w-4 h-4 text-emerald-400" />
							<p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">
								Project Owner Dashboard
							</p>
						</div>
						<h1 className="text-3xl font-bold tracking-tight">
							Project Portfolio
						</h1>
						<p className="text-sm text-slate-400 max-w-xl">
							Submit construction proposals, monitor AI-driven risk scoring, and
							track real-time funding on Mantle Network.
						</p>
					</div>

					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
								<Plus className="w-4 h-4 mr-2" /> Submit New Project
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[525px] bg-slate-900 border-slate-800 text-slate-50 shadow-2xl flex flex-col max-h-[90vh]">
							<DialogHeader>
								<DialogTitle className="text-xl">
									New Construction Proposal
								</DialogTitle>
								<DialogDescription className="text-slate-400 text-xs">
									Provide project details and documents. AI will perform
									automated risk assessment.
								</DialogDescription>
							</DialogHeader>
  						<form method="POST" onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-2">
  							<div className="grid gap-5 py-4">
  								<div className="grid gap-2">
  									<Label htmlFor="name" className="text-xs font-semibold text-slate-300">
  										Project Name
  									</Label>
  									<Input
  										id="name"
  										{...register("name")}
  										placeholder="e.g. Cluster Harmoni Phase 3"
  										className="bg-slate-950 border-slate-800 text-sm focus:ring-emerald-500/50"
  									/>
                    {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
  								</div>
  								
  								<div className="grid gap-2">
  									<Label htmlFor="description" className="text-xs font-semibold text-slate-300">
  									  Description
  									</Label>
  									<Textarea
  										id="description"
  										{...register("description")}
  										placeholder="e.g. Indonesia, Samarinda"
  										className="bg-slate-950 border-slate-800 text-sm focus:ring-emerald-500/50"
  									/>
                    {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.description.message}</p>}
  								</div>
  								
  								<div className="grid gap-2">
  									<Label htmlFor="location" className="text-xs font-semibold text-slate-300">
  									  Location
  									</Label>
  									<Input
  										id="location"
  										{...register("location")}
  										placeholder="e.g. Indonesia, Samarinda"
  										className="bg-slate-950 border-slate-800 text-sm focus:ring-emerald-500/50"
  									/>
                    {errors.location && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.location.message}</p>}
  								</div>
  								
  								<div className="grid gap-2">
  									<Label htmlFor="estimated_budget" className="text-xs font-semibold text-slate-300">
  							      Estimated Budget (USDC)
  									</Label>
  									<Input
  										id="estimated_budget"
  										{...register("estimated_budget")}
  										placeholder="e.g. 1000"
  										className="bg-slate-950 border-slate-800 text-sm focus:ring-emerald-500/50"
  									/>
                    {errors.estimated_budget && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.estimated_budget.message}</p>}
  								</div>
  
  								<div className="grid gap-2">
  									<Label htmlFor="target" className="text-xs font-semibold text-slate-300">
  										Funding Target (USDC)
  									</Label>
  									<Input
  										id="target"
  										{...register("target")}
  										placeholder="50000"
  										className="bg-slate-950 border-slate-800 text-sm focus:ring-emerald-500/50"
  									/>
                    {errors.target && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.target.message}</p>}
  								</div>
          
  								<div className="grid gap-2">
   									<Label htmlFor="target_apy" className="text-xs font-semibold text-slate-300">
    										Target APY (%)
   									</Label>
   									<Input
  										id="target_apy"
  										{...register("target_apy")}
  										type="text"
  										placeholder="10.5"
  										className="bg-slate-950 border-slate-800 text-sm focus:ring-emerald-500/50"
   									/>
                    {errors.target_apy && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.target_apy.message}</p>}
  								</div>
  								
  								<div className="grid gap-2">
  									<Label htmlFor="estimated_durations" className="text-xs font-semibold text-slate-300">
  							      Estimated Durations (Years)
  									</Label>
  									<Input
  										id="estimated_durations"
  										{...register("estimated_durations")}
  										type="number"
  										placeholder="e.g. 1000"
  										className="bg-slate-950 border-slate-800 text-sm focus:ring-emerald-500/50"
  									/>
                    {errors.estimated_durations && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.estimated_durations.message}</p>}
  								</div>
  
  								<div className="grid gap-2">
  									<Label className="text-xs font-semibold text-slate-300 uppercase tracking-tighter">
  										Required Documents
  									</Label>
  									<div className="grid grid-cols-2 gap-2">
  										<DocumentUploadButton label="Land Certificate" onFileSelect={(file) => setValue("land_certificate", file)} />
  										<DocumentUploadButton label="Building Permit" onFileSelect={(file) => setValue("building_permit", file)} />
  										<DocumentUploadButton label="Site Plan" onFileSelect={(file) => setValue("site_plan", file)} />
  										<DocumentUploadButton label="Budget Plan (RAB)" onFileSelect={(file) => setValue("budget_plan", file)} />
                      {errors.land_certificate && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.land_certificate.message}</p>}
                      {errors.building_permit && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.building_permit.message}</p>}
                      {errors.site_plan && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.site_plan.message}</p>}
                      {errors.budget_plan && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.budget_plan.message}</p>}
  									</div>
  								</div>
  							</div>
                {isPending && progress && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-400 font-mono mb-4">
                    <Activity className="w-3 h-3 animate-pulse" />
                    {progress}
                  </div>
                )}
  							<DialogFooter>
  								<Button
  									className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-11"
                    disabled={isPending}
  								>
  								  Submit Project
  								</Button>
  							</DialogFooter>
  						</form>
						</DialogContent>
					</Dialog>
				</header>

				<section className="grid gap-4 md:grid-cols-3">
					<SummaryCard
						icon={<Activity className="w-4 h-4 text-emerald-400" />}
						label="Total Capital Received"
            value={formatUSDC(totalCapitalReceived)}
						sub="Total funds in vault"
					/>
					<SummaryCard
						icon={<TrendingDown className="w-4 h-4 text-red-400" />}
						label="Total Repayment Due"
						value={formatUSDC(totalOwed)}
						sub="Funds + APY"
					/>
					<SummaryCard
						icon={<CheckCircle2 className="w-4 h-4 text-blue-400" />}
						label="Next Deadline"
						value="-"
						sub="Green Valley Residence"
					/>
				</section>

				<section className="space-y-4 pt-4">
					<div className="flex items-center gap-2">
						<h2 className="text-lg font-semibold tracking-tight">
							Active Pipelines
						</h2>
					</div>
					<div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-x-auto backdrop-blur-xl">
						<table className="w-full text-sm">
							<thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
								<tr>
								  <th className="px-6 py-4 text-left font-bold">No.</th>
									<th className="px-6 py-4 text-left font-bold">Project</th>
									<th className="px-6 py-4 text-left font-bold">Status</th>
									<th className="px-6 py-4 text-left font-bold">Grade</th>
									<th className="px-6 py-4 text-left font-bold">Target Funds</th>
									<th className="px-6 py-4 text-left font-bold">Progress</th>
									<th className="px-6 py-4 text-left font-bold">Total Owed</th>
									<th className="px-6 py-4 text-right font-bold">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-800/40">
  							{isLoading && (
                  <tr className="hover:bg-white/2 transition-colors group">
                    <td className="px-6 py-4 text-center" colSpan={8}>Loading…</td>
                  </tr>
                )}
                {projects?.map((p, key) => {
                  const vault = p.vaults?.[0];
                  
                  const progressPercent = vault
                    ? Number(
                        (BigInt(vault.funds) * 10_000n) /
                        BigInt(vault.target_funds)
                      ) / 100
                    : 0;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/2 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        {key + 1}.
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-100">
                        {p.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black ${getStatusStyle(p.vaults?.[0]?.status ?? p.status)}`}
                        >
                          {p.vaults?.[0]?.status ?? p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded-md text-slate-300 border border-slate-700/50">
                          {p.ai_risk_grade} ({p.ai_risk_score})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {formatUSDC(p.target)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-32.5 space-y-2">
                          <div className="flex flex-col gap-1 justify-between text-xs font-mono">
                            <span className="text-slate-500">{formatUSDC(p.vaults?.[0]?.funds ?? 0)}</span>
                            <span className="text-emerald-400">
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {formatUSDC(p.vaults?.[0]?.outstanding)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-center items-center gap-2">
                          {
                            p.vaults?.[0]?.status === 'REPAYING' ? 
                            <Button size={'sm'} onClick={() => {
                              setRepayOpen(true)
                              setSelectedPool(p.vaults?.[0])
                            }} className="cursor-pointer text-white hover:text-white bg-cyan-800 hover:bg-cyan-900">
                            Repay
                          </Button> : ''
                          }
                        {p.status === "Rejected" ? (
                          <Button
                            size="sm"
                            className="bg-red-500/10 text-red-400 border border-red-500/50 h-7 px-4 hover:bg-red-500 hover:text-white"
                            onClick={() => setIsOpen(true)}
                          >
                            Update Docs
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className=" cursor-pointer text-white bg-slate-800 hover:bg-slate-900"
                            onClick={() => {
                              if (p.vaults?.[0]?.address_vault) {
                                window.open(
                                  `https://sepolia.etherscan.io/address/${p.vaults?.[0]?.address_vault}`,
                                  "_blank"
                                )
                              } else {
                                setIsError(true)
                                setErrorMessage('Tidak ada address vault!');
                              }
                            }}
                          >
                            Explorer <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                          </Button>
                        )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
							</tbody>
						</table>
					</div>
				</section>
			</div>
			<QuickRepayDialog 
	      open={repayOpen}
				onOpenChange={setRepayOpen}
				pool={selectedPool}
				disabled={isPendingRepay}
				onConfirm={(amount) => {
		      onRepay({
						id: selectedPool.id,
						amount: BigInt(amount * 1_000_000),
						address: selectedPool.address_vault
					})
				}}
			/>
			<SuccessDialog 
	      title="Success Submit Project"
				message={successMessage}
				open={isSuccess}
				onOpenChange={() => {
				  setIsSuccess(false)
				}}
			/>
			<ErrorDialog 
	      title="Error"
				error={errorMessage}
				open={isError}
				onOpenChange={() => {
				  setIsError(false)
				}}
			/>
		</main>
	);
}