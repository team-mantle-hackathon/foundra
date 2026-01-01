import type { ReactNode } from "react";
import { Outlet } from "react-router";
import HeaderDashboard from "./header";

export default function LayoutDashboard(): ReactNode {
	return (
		<>
			<HeaderDashboard />
			<Outlet />
		</>
	);
}
