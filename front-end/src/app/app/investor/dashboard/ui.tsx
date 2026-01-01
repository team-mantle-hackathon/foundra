import {
	ArrowUpRight,
	Clock,
	DollarSign,
	Layers,
	MapPin,
	ShieldCheck,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link } from "react-router";
import { useAccount } from "wagmi";
import { ErrorDialog } from "@/components/error-dialog";
import { SuccessDialog } from "@/components/success-dialog";
import { Button } from "@/components/ui/button";
import { useDeposit } from "@/hooks/use-deposit";
import { useInvestorHoldings } from "@/hooks/use-investor-holdings";
import { useListPools } from "@/hooks/use-list-pools";
import { useRedeem } from "@/hooks/use-redeem";
import { formatUSDC } from "@/lib/utils";
import { QuickInvestDialog } from "./components/quick-invest-dialog";
import { SummaryCard } from "./components/summary-card";

export default function InvestorDashboard(): ReactNode {
	const { address } = useAccount();

	const { data: pools, isLoading: isLoadingPools } = useListPools();

	const { data: holdings, isLoading: isLoadingHoldings } =
		useInvestorHoldings(address);
	
  const { mutate: deposit, isPending: isPendingDeposit } = useDeposit();
  
  const { mutate: redeem, isPending: isPendingRedeem } = useRedeem();

	const [selectedPool, setSelectedPool] = useState<any>(null);
	const [openInvest, setOpenInvest] = useState(false);
	
	const [isSuccess, setIsSuccess]       = useState<boolean>(false);
  const [isError, setIsError]           = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const totalInvested =
    holdings?.reduce(
      (acc, h) => acc + BigInt(h.amount),
      0n
    ) ?? 0n;
	
	const totalExpectedReturn =
  holdings?.reduce((acc, h) => acc + h.estReturn, 0n) ?? 0n;

	const activePositions = holdings
		? new Set(holdings.map((h) => h.id)).size
		: 0;
	
	const onDeposit = (payload: any): void => {
  	deposit(payload, {
      onSuccess: () => {
			  setOpenInvest(false)
				setIsSuccess(true)
      },
      onError: (error) => {
        setOpenInvest(false)
				setErrorMessage(error.message || "Something went wrong on-chain or database.");
        setIsError(true);
      }
    })
	}
	
	const onRedeem = (payload: any): void => {
	console.log(payload)
	  redeem({
			vaultId: payload.id,
			vaultAddress: payload.address_vault,
			shares: payload.shares
		}, {
      onSuccess: () => {
        setIsSuccess(true)
      },
      onError: (error) => {
        setErrorMessage(error.message || "Something went wrong on-chain or database.");
        setIsError(true);
      }
		})
	}

	return (
		<main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
			<div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-10">
				{/* Header */}
				<header className="relative space-y-2">
					<div className="flex items-center gap-2 mb-1">
						<div className="h-[1px] w-8 bg-emerald-500" />
						<p className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-bold">
							Investor Dashboard
						</p>
					</div>
					<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
						Investment Positions
					</h1>
					<p className="text-sm text-slate-400 max-w-xl leading-relaxed">
						Manage positions and explore construction pools.
					</p>
				</header>

				{/* Summary Metrics */}
				<section className="grid gap-4 md:grid-cols-3">
					<SummaryCard
						label="Total Invested"
						value={formatUSDC(totalInvested)}
						sub="Principal in active notes"
						icon={<Wallet className="w-4 h-4 text-emerald-400" />}
					/>
					<SummaryCard
						label="Est. Total Return"
						value={formatUSDC(totalExpectedReturn)}
						sub="Current portfolio yield"
						icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
					/>
					<SummaryCard
						label="Active Positions"
						value={activePositions}
						sub="Running financing pools"
						icon={<Layers className="w-4 h-4 text-emerald-400" />}
					/>
				</section>

				{/* Current Holdings */}
				<section className="space-y-4">
					<div className="flex items-center gap-2">
						<ShieldCheck className="w-4 h-4 text-slate-500" />
						<h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
							Active Holdings
						</h2>
					</div>
					<div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-x-auto backdrop-blur-sm">
						<table className="w-full text-sm">
							<thead className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
								<tr>
									<th className="px-6 py-4 text-left font-bold">No.</th>
									<th className="px-6 py-4 text-left font-bold">
										Project Pool
									</th>
									<th className="px-6 py-4 text-left font-bold">Target APY</th>
									<th className="px-6 py-4 text-left font-bold">Investment</th>
									<th className="px-6 py-4 text-left font-bold">Est. Return</th>
									<th className="px-6 py-4 text-left font-bold">Status</th>
									<th className="px-6 py-4 text-left font-bold">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-800/50">
								{isLoadingHoldings ? (
									<tr className="hover:bg-white/2 transition-colors group text-slate-200">
										<td
											className="px-6 py-4 font-medium text-slate-100 text-center"
											colSpan={6}
										>
											Loading
										</td>
									</tr>
								) : (
									""
								)}
								{holdings?.length == 0 ? (
									<tr className="hover:bg-white/2 transition-colors group text-slate-200">
										<td
											className="px-6 py-4 font-medium text-slate-100 text-center"
											colSpan={6}
										>
											No Data Investment
										</td>
									</tr>
								) : (
									""
								)}
								{holdings?.map((h, key) => (
									<tr
										key={h.id}
										className="hover:bg-white/2 transition-colors group text-slate-200"
									>
										<td className="px-6 py-4 font-medium text-slate-100">
											{key + 1}
										</td>
										<td className="px-6 py-4 font-medium text-slate-100">
											{h.name}
										</td>
										<td className="px-6 py-4 font-mono text-emerald-400/90">
											{h.apy}
										</td>
										<td className="px-6 py-4 font-mono">{formatUSDC(h.amount)}</td>
										<td className="px-6 py-4 font-mono text-emerald-400 font-bold">
											{formatUSDC(h.estReturn)}
										</td>
										<td className="px-6 py-4">
											<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
												{h.status_vault}
											</span>
										</td>
										<td className="px-6 py-4">
                      {h.status_vault === "COMPLETED" || h.status_vault === "CANCELLED" ? (
                        <Button
                          size="sm"
                          className="bg-emerald-500 text-slate-950 hover:bg-emerald-700 font-bold cursor-pointer"
                          onClick={() => onRedeem(h)}
                        >
                          Redeem
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500">Locked</span>
                      )}
                    </td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* Discovery Pools */}
				<section className="space-y-6 pt-4">
					<div className="flex items-center justify-between border-b border-slate-800 pb-4">
						<div>
							<h2 className="text-lg font-bold text-slate-100">
								Market Opportunities
							</h2>
							<p className="text-xs text-slate-500">
								Curated construction pools with verified AI grading.
							</p>
						</div>
						{/*<Button variant="outline" className="border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-emerald-400 text-[11px] h-8 transition-all font-bold uppercase tracking-tighter">
              View All Vaults
            </Button>*/}
					</div>

					<div className="grid gap-4 md:grid-cols-2 text-white">
						{pools?.map((p) => (
							<div
								key={p.id}
								className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6 hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
							>
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
											{p.name}
										</h3>
										<div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 uppercase font-semibold tracking-tighter">
											<MapPin className="w-3 h-3" />
											{p.location}
										</div>
									</div>
									<div className="text-right">
										<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
											AI Risk Grade
										</p>
										<span className="inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
											{p.risk}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
									<div className="space-y-1">
										<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
											Target APY
										</p>
										<p className="text-xl font-mono font-bold text-emerald-400 tracking-tighter">
											{p.apy}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
											Tenor
										</p>
										<div className="flex items-center gap-2 text-slate-200 font-semibold uppercase tracking-tighter">
											<Clock className="w-3.5 h-3.5 text-slate-400" />
											{p.tenor}
										</div>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2">
								<Link to={`/app/investor/vault/${p.address_vault}`}>
									<Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest h-11 shadow-lg shadow-emerald-500/10 transition-all active:scale-95">
										View Pool <ArrowUpRight className="ml-2 w-4 h-4" />
									</Button>
								</Link>
									<Button
										disabled={p.status_vault !== "FUNDRAISING"}
										onClick={() => {
											setSelectedPool(p);
											setOpenInvest(true);
										}}
										className="w-full hover:bg-emerald-500 bg-white border-emerald-500 hover:border-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest h-11 shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
									>
										Quick Invest <DollarSign className="ml-2 w-4 h-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
			{selectedPool && (
				<QuickInvestDialog
					open={openInvest}
					onOpenChange={setOpenInvest}
					disabled={isPendingDeposit}
					pool={{
						id: selectedPool.id,
						name: selectedPool.name,
						apy: selectedPool.apy,
						status_vault: selectedPool.status_vault,
					}}
					onConfirm={(amount) => {
						onDeposit({
              vaultId: selectedPool.id,
              vaultAddress: selectedPool.address_vault,
              amount: BigInt(Math.floor(amount * 1_000_000))
						})
					}}
				/>
			)}
			
			<SuccessDialog
	      title="Success"
				message={"Success Submit On Chain"}
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
