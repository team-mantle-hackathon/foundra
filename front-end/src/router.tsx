import { createBrowserRouter } from "react-router";
import AdminDashboardPage from "./app/app/admin/dashboard/page";
import AdminDeveloperPage from "./app/app/admin/developer/page";
import AdminProjectPage from "./app/app/admin/project/page";
import DeveloperDashboardPage from "./app/app/developer/dashboard/page";
import RegisterDeveloperPage from "./app/app/developer/register/page";
import VerificationDeveloperPage from "./app/app/developer/verification/page";
import InvestorDashboardPage from "./app/app/investor/dashboard/page";
import VaultDetailInvestorPage from "./app/app/investor/vault-detail/page";
import VerificationInvestorPage from "./app/app/investor/verification/page";
import VerifierDashboardPage from "./app/app/verifier/dashboard/page";
import LoginPage from "./app/auth/login/page";
import DeveloperPage from "./app/developer/page";
import ExplorePage from "./app/explore/page";
import HomePage from "./app/home/page";
import NotFoundPage from "./app/not-found";
import VaultPage from "./app/vault/page";
import VaultDetailPage from "./app/vault-detail/page";
import Layout from "./components/layout/layout";
import LayoutDashboard from "./components/layout-dashboard/layout";

export const router = createBrowserRouter([
  
  {
    path: "app",
    children: [
      {
        index: true, 
        element: <LoginPage /> 
      },
      {
        path: "",
        element: <LayoutDashboard />, 
        children: [
          {
            path: "admin",
            element: <AdminDashboardPage />
          },
          {
            path: "admin/developers",
            element: <AdminDeveloperPage />
          },
          {
            path: "admin/projects",
            element: <AdminProjectPage />
          },
          {
            path: "developer",
            element: <DeveloperDashboardPage />
          },
          {
            path: "developer/register",
            element: <RegisterDeveloperPage />
          },
          {
            path: "developer/verification",
            element: <VerificationDeveloperPage />
          },
          {
            path: "investor",
            element: <InvestorDashboardPage />
          },
          {
            path: "investor/verification",
            element: <VerificationInvestorPage />
          },
          {
            path: "investor/vault/:address",
            element: <VaultDetailInvestorPage />
          },
          {
            path: "verifier",
            element: <VerifierDashboardPage />
          }
        ]
      }
    ]
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "vaults/:txhash",
        element: <VaultDetailPage />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
      },
      {
        path: "vaults",
        element: <VaultPage />,
      },
      {
        path: "developer",
        element: <DeveloperPage />,
      }
    ],
  },
  {
      path: "*",
      element: <NotFoundPage />
    }
]);
