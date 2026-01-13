import { 
  BanknoteArrowDown,
  CheckCircle,
  ExternalLink,
  FileSearch,
  MoreVertical,
  ShieldCheck, 
  Wallet, 
  XCircle,} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAccount } from "wagmi";
import { ErrorDialog } from "@/components/error-dialog";
import { ProgressDialog } from "@/components/process-dialog";
import { SuccessDialog } from "@/components/success-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApproveProjectAdmin } from "@/hooks/use-approve-project-admin";
import { useDisburseFunds } from "@/hooks/use-disburse-funds";
import { useProjectsAdmin } from "@/hooks/use-projects-admin";
import { useRejectProjectAdmin } from "@/hooks/use-reject-project-admin";
import { formatUSDC, ipfsToHttp } from "@/lib/utils";
import { RejectReasonDialog } from "./components/reject-reason-dialog";

export default function AdminProject(): ReactNode {
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressText, setProgressText] = useState<string | null>(null);
  const [progressTitle, setProgressTitle] = useState<string>("Processing...");
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
	const { data: projects, isLoading } = useProjectsAdmin();
  const { mutate: approvalProject, isPending } = useApproveProjectAdmin(setProgressText);
  const { mutate: rejectedProject, isPending: isPendingReject } = useRejectProjectAdmin(setProgressText);
  const { mutate: disburseFunds, isPending: isPendingDisburseFunds } = useDisburseFunds(setProgressText);

	const getStatusStyle = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
			case "REJECTED":
				return "text-red-400 bg-red-500/10 border-red-500/20";
			case "COMPLETED":
				return "text-purple-400 bg-purple-500/10 border-purple-500/20";
			default:
				return "text-slate-400 bg-slate-500/10 border-slate-500/20";
		}
	};
	
	const openProgress = (title: string) => {
    setProgressTitle(title);
    setProgressText("Preparing...");
    setTxHash(null);
    setProgressOpen(true);
  };
  
  const closeProgress = () => {
    setProgressOpen(false);
    setProgressText(null);
  };
	
  const approveProject = (payload: {
    id: string;
    target: number;
    estimated_durations: number;
    onchain_id: number;
  }) => {
    openProgress("Approving Project");
    console.log(payload)
    approvalProject(payload, {
      onSuccess:(success) => {
        setTxHash(success.hash);
        closeProgress();
        setSuccessMessage("Sukses approve project");
        setIsSuccess(true);
      },
      onError: (error) => {
        closeProgress();
        setErrorMessage(error?.message ?? "Approve failed");
        setIsError(true);
      }
    })
	}
  
  const rejectProject = (reason: string): void => {
    
    if (!selectedProject) return;
    setRejectOpen(false);
  
    openProgress("Rejecting Project");
    
    rejectedProject({ id: selectedProject.id, onchain_id: selectedProject.onchain_id, reason }, {
      onSuccess: (success) => {
        setTxHash(success.hash);
        closeProgress();
        setSuccessMessage("Success reject project");
        setIsSuccess(true);
      },
      onError: (error) => {
        closeProgress();
        setErrorMessage(error?.message ?? "Reject failed");
        setIsError(true);
      }
    });
  }
  
  const onDisburse = (vaultId: string, vaultAddress: `0x${string}`): void => {
    openProgress("Disbursing Funds");
    
    disburseFunds( { vaultId, vaultAddress }, {
      onSuccess: (success) => {
        setTxHash(success);
        closeProgress();
        setSuccessMessage("Success disburse funds");
        setIsSuccess(true);
      },
      onError: (error) => {
        closeProgress();
        setErrorMessage(error?.message ?? "Disburse failed");
        setIsError(true);
      }
    });
  }

	return (
		<main className="min-h-screen bg-slate-950 text-slate-50">
			<div className="max-w-7xl mx-auto px-6 pt-36 pb-16 space-y-8">
				{/* HEADER */}
				<header className="flex items-center justify-between border-b border-slate-800 pb-6">
					<div>
						<div className="flex items-center gap-2">
							<ShieldCheck className="w-4 h-4 text-red-400" />
							<p className="text-xs text-red-400 font-bold uppercase tracking-widest">
								Admin Dashboard
							</p>
						</div>
						<h1 className="text-3xl font-bold">List Projects</h1>
						<p className="text-sm text-slate-400">
							Review, approve, or reject submitted projects.
						</p>
					</div>
				</header>

				{/* TABLE */}
				<div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-slate-900 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
							<tr>
					      <th className="px-6 py-4 text-left">No.</th>
								<th className="px-6 py-4 text-left">Project</th>
								<th className="px-6 py-4 text-left">Location</th>
								<th className="px-6 py-4 text-left">Est. Dur (Years)</th>
								<th className="px-6 py-4 text-left w-32">Grade</th>
								<th className="px-6 py-4 text-left">Target</th>
								<th className="px-6 py-4 text-left">Funds</th>
								<th className="px-6 py-4 text-left">Status</th>
								<th className="px-6 py-4 text-right">Action</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-800/40">
							{isLoading && (
								<tr>
									<td
										colSpan={10}
										className="px-6 py-10 text-center text-slate-500"
									>
										Loading projects…
									</td>
								</tr>
							)}

							{projects?.map((p, key) => (
								<tr key={p.id} className="hover:bg-white/2">
                  <td className="px-6 py-4">{key+1}</td>
									<td className="px-6 py-4 font-medium">{p.name}</td>

									<td className="px-6 py-4 text-slate-400">{p.location}</td>
									
									<td className="px-6 py-4 text-slate-400">{p.estimated_durations}</td>

									<td className="px-6 py-4">
										<span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
											{p.ai_risk_grade ?? "TBA"}{" "}
											{p.ai_risk_score ? `(${p.ai_risk_score})` : ""}
										</span>
									</td>

									<td className="px-6 py-4 text-slate-300 font-mono">
										{formatUSDC(p.target)}
									</td>
									
									<td className="px-6 py-4 text-slate-300 font-mono">
										{formatUSDC(p.vaults?.[0]?.funds ?? 0)}
									</td>

									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusStyle(p.vaults?.[0]?.status ?? p.status)}`}
										>
											{p.vaults?.[0]?.status ?? p.status}
										</span>
									</td>

									<td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                  
                      <DropdownMenuContent align="end" className="w-56">
                  
                        {/* TX LINKS */}
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(
                              `https://sepolia.mantlescan.xyz/tx/${p.tx_hash}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Tx Hash Project
                        </DropdownMenuItem>
                  
                        {p.vaults?.[0]?.tx_hash && (
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `https://sepolia.mantlescan.xyz/tx/${p.vaults?.[0]?.tx_hash}`,
                                "_blank"
                              )
                            }
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Tx Hash Vault
                          </DropdownMenuItem>
                        )}
                  
                        {p.vaults?.[0]?.address_vault && (
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `https://sepolia.mantlescan.xyz/address/${p.vaults?.[0]?.address_vault}`,
                                "_blank"
                              )
                            }
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            Vault Address
                          </DropdownMenuItem>
                        )}
                  
                        <DropdownMenuSeparator />
                        
                        {/* DOCUMENTS */}
                        <DropdownMenuItem
                          onClick={() => {
                            const url = ipfsToHttp(p.ipfs_documents);
                            window.open(url, "_blank");
                          }}
                        >
                          <FileSearch className="w-4 h-4 mr-2" />
                          Check Documents
                        </DropdownMenuItem>
                        {/* ACTIONS */}
                  
                        {
                          p.vaults.length == 0 && p.status != 'REJECTED' ?
                          <>  
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-emerald-400 focus:text-emerald-400"
                            onClick={() => {
                              approveProject({
                                id: p.id,
                                estimated_durations: p.estimated_durations,
                                target: p.target,
                                onchain_id: p.onchain_id
                              })
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isPending ? 'Loading...' : 'Approve Project'}
                          </DropdownMenuItem>
                    
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-400"
                            onClick={() => {
                              setSelectedProject(p);
                              setRejectOpen(true);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                                {isPendingReject ? 'Loading...' : 'Reject Project'}
                          </DropdownMenuItem>
                         </> : ''
                        }
                        
                        {
                          p.vaults.length > 0 && p.vaults[0].status === 'ACTIVE' ? 
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDisburse(p.vaults[0].id, p.vaults[0].address_vault)}
                            >
                              <BanknoteArrowDown className="w-4 h-4 mr-2" />
                              {isPendingDisburseFunds ? 'Loading...' : 'Disburse Funds'}
                            </DropdownMenuItem>
                          </> : ''
                        }
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<ProgressDialog
        open={progressOpen}
        onOpenChange={setProgressOpen}
        title={progressTitle}
        description="Don't close this dialog until finish!"
        progress={progressText}
        txHash={txHash}
        explorerTxUrl={txHash ? `https://sepolia.mantlescan.xyz/tx/${txHash}` : null}
        canClose={!(isPending || isPendingReject || isPendingDisburseFunds)}
      />
      
      <RejectReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        disabled={isPendingReject}
        onConfirm={rejectProject}
      />
      
      <SuccessDialog
        title="Success"
        message={successMessage}
        open={isSuccess}
        onOpenChange={setIsSuccess}
      />
      
      <ErrorDialog
        title="Error"
        error={errorMessage}
        open={isError}
        onOpenChange={setIsError}
      />
		</main>
	);
}
