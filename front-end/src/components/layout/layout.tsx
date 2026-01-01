import type { ReactNode } from "react";
import HeaderLayout from "./header";
import { Outlet } from "react-router";
import FooterLayout from "./footer";
import { ScrollRestoration } from "react-router";

export default function Layout(): ReactNode {
  return(
    <>
      <ScrollRestoration />
      <HeaderLayout />
      <main className="min-h-96 p-5 bg-slate-950 text-slate-50 font-sans">
        <Outlet />
      </main>
      <FooterLayout />
    </>
  )
}