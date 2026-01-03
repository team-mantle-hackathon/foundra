import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Briefcase, Loader2, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function Login(): ReactNode {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [loadingRole, setLoadingRole] = useState<"investor" | "developer" | null>(null);

  const redirectUser = useCallback((role: string) => {
    const targetPath = role === "project-owner" ? "/app/developer/verification" : "/app/investor/verification";
    navigate(targetPath);
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    
    const autoCheck = async () => {
      if (isConnected && address && isMounted) {
        setIsChecking(true);
        try {
          const { data, error } = await supabase
            .from('user_auths')
            .select('role')
            .eq('wallet_address', address)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            const roleMapping: Record<string, string> = {
              "admin": "admin",
              "project-owner": "developer",
              "investor": "investor"
            };
            localStorage.setItem("user_role", roleMapping[data.role]);
    
            if (data.role === "admin") navigate("/app/admin");
            else if (data.role === "project-owner") navigate("/app/developer");
            else navigate("/app/investor");
          }
        } catch (err) {
          console.error("Auto-check failed:", err);
        } finally {
          setIsChecking(false);
        }
      }
    };

    autoCheck();
    return () => { isMounted = false; };
  }, [isConnected, address, redirectUser]);

  const handleSelectRole = async (selectedRole: "developer" | "investor") => {
    if (!address) return alert("Wallet not connected!");
    
    setIsLoading(true);
    setLoadingRole(selectedRole);
    try {
      const roleValue = selectedRole === "developer" ? "project-owner" : "investor";
      
      const { error: insertError } = await supabase
        .from('user_auths')
        .insert({ 
          wallet_address: address, 
          role: roleValue,
          is_verified: false
        });

      if (insertError) throw insertError;

      localStorage.setItem("user_role", selectedRole);
      redirectUser(roleValue);

    } catch (error: any) {
      console.error("Supabase Error:", error.message);
      alert("Failed to create profile. Check RLS or DB constraints.");
    } finally {
      setIsLoading(false);
      setLoadingRole(null);
    }
  };

  if (isChecking) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-sm font-black uppercase tracking-widest animate-pulse">Checking Profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full" />

      <Card className="w-full max-w-2xl border-slate-800 bg-slate-900/50 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter italic">
            {isConnected ? "Select Your Role" : "Welcome to RWA Core"}
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium">
            {isConnected 
              ? "Account not found. Please select your role to continue." 
              : "Connect your institutional wallet to access the Mantle RWA ecosystem."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isConnected ? (
            <div className="flex justify-center py-10 border-2 border-dashed border-slate-800 rounded-3xl">
              <ConnectButton.Custom>
                {({
                  account,
                  openConnectModal,
                  mounted,
                }) => {
                  if (!mounted) return null;
              
                  if (!account) {
                    return (
                      <Button type="button" className="w-52 rounded-lg bg-emerald-600 hover:bg-emerald-800 cursor-pointer" onClick={openConnectModal}>
                        Connect Wallet
                      </Button>
                    );
                  }
              
                  return (
                    <Button type="button" className="md:max-w-lg w-full bg-emerald-600 hover:bg-emerald-800 text-white">
                      {account.displayName}
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
              <button
                type='button'
                disabled={isLoading}
                onClick={() => handleSelectRole("investor")}
                className={`group p-6 rounded-2xl border border-slate-800 bg-slate-950/50 hover:border-emerald-500/50 transition-all text-left space-y-4 
                      ${loadingRole === "investor" ? "border-emerald-500 bg-emerald-500/5" : ""}
                      ${loadingRole && loadingRole !== "investor" ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  {loadingRole === "investor" ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase italic">Investor</h3>
                  <p className="text-xs text-slate-500 font-medium">Access yields.</p>
                </div>
              </button>

              <button
                type='button'
                disabled={isLoading}
                onClick={() => handleSelectRole("developer")}
                className={`group p-6 rounded-2xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/50 transition-all text-left space-y-4 
                      ${loadingRole === "developer" ? "border-cyan-500 bg-cyan-500/5" : ""}
                      ${loadingRole && loadingRole !== "developer" ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  {loadingRole === "developer" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Briefcase className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase italic">Project Owner</h3>
                  <p className="text-xs text-slate-500 font-medium">Tokenize assets.</p>
                </div>
              </button>
            </div>
          )}
        </CardContent>
        {/* Footer connected info tetep sama */}
      </Card>
    </main>
  );
}