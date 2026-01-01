import type { ReactNode } from "react";
import { Skeleton } from "@/components/skeleton";

export function SkeletonDetail(): ReactNode {
	return (
		<main className="min-h-screen bg-slate-950 px-4 pt-24">
			<div className="max-w-4xl mx-auto space-y-10">
				{/* Header */}
				<div className="space-y-3">
					<Skeleton className="h-8 w-2/3" />
					<Skeleton className="h-4 w-1/3" />
				</div>

				{/* Description */}
				<div className="space-y-2 max-w-2xl">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/6" />
				</div>

				{/* Metrics */}
				<div className="grid grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2"
						>
							<Skeleton className="h-3 w-1/2" />
							<Skeleton className="h-6 w-2/3" />
						</div>
					))}
				</div>

				{/* CTA */}
				<Skeleton className="h-12 w-40 rounded-lg" />
			</div>
		</main>
	);
}
