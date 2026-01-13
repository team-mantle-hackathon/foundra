import {
	CheckCircle2,
	FileClock,
	ShieldCheck,
	Users,
	Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { useDashboardAdmin } from "@/hooks/use-dashboard-admin";
import { SummaryCard } from "./components/summary-card";

export default function AdminDashboardHome(): ReactNode {
	const { data, isLoading } = useDashboardAdmin();

	return (
		<main className="min-h-screen bg-slate-950 text-slate-50">
			<div className="max-w-7xl mx-auto px-6 pt-36 pb-16 space-y-10">
				{/* HEADER */}
				<header className="border-b border-slate-800 pb-6">
					<div className="flex items-center gap-2">
						<ShieldCheck className="w-4 h-4 text-red-400" />
						<p className="text-xs text-red-400 font-bold uppercase tracking-widest">
							Admin Dashboard
						</p>
					</div>
					<h1 className="text-3xl font-bold mt-1">Platform Overview</h1>
					<p className="text-sm text-slate-400 mt-1">
						Monitor KYC, projects, pools, and repayments.
					</p>
				</header>

				{/* SUMMARY */}
				<section className="grid grid-cols-1 md:grid-cols-5 gap-4">
					<SummaryCard
						icon={<Users className="w-4 h-4 text-amber-400" />}
						label="Pending KYC"
						value={isLoading ? "—" : String(data?.pendingOwners)}
						sub="Project owners awaiting approval"
					/>

					<SummaryCard
						icon={<FileClock className="w-4 h-4 text-blue-400" />}
						label="Pending Projects"
						value={isLoading ? "—" : String(data?.pendingProjects)}
						sub="Waiting admin decision"
					/>

					<SummaryCard
						icon={<Wallet className="w-4 h-4 text-emerald-400" />}
						label="Fundraising Pools"
						value={isLoading ? "—" : String(data?.fundraisingPools)}
						sub="Open for investment"
					/>

					<SummaryCard
						icon={<Wallet className="w-4 h-4 text-purple-400" />}
						label="Disburse Ready"
						value={isLoading ? "—" : String(data?.disburseReadyPools)}
						sub="Funds ready to release"
					/>

					<SummaryCard
						icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
						label="Completed Projects"
						value={isLoading ? "—" : String(data?.completedProjects)}
						sub="Fully repaid"
					/>
				</section>
			</div>
		</main>
	);
}
