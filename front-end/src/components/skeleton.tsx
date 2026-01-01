import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }): ReactNode {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-slate-800/60", className)}
		/>
	);
}
