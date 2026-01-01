import type { ReactNode } from "react";

export function SummaryCard({
	label,
	value,
	sub,
	icon,
}: {
	label: string;
	value: string;
	sub?: string;
	icon: ReactNode;
}): ReactNode {
	return (
		<div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md hover:border-slate-700 transition-colors">
			<div className="flex items-center gap-2 mb-3">
				{icon}
				<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
					{label}
				</p>
			</div>
			<p className="text-2xl font-bold tracking-tight text-white">{value}</p>
			{sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
		</div>
	);
}