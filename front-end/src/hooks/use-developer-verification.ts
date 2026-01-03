import { waitForTransactionReceipt } from "@wagmi/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConfig, useWriteContract } from "wagmi";
import { protocolAbi } from "@/constants/abi/abi-protocol-registry";
import { supabase } from "@/lib/supabase";

export type DevRow = {
  id: number; // user_auths.id (int8)
  name: string | null;
  wallet_address: string;
  role: string;

  // user_auths.is_verified = ZK-KYC
  zk_verified: boolean;

  // project_owners.is_verified = manual KYC
  manual_verified: boolean;

  project_owner_id?: string | null;
  project_owner_tx_hash?: string | null;
};

type UseDeveloperVerificationListOptions = {
  role?: string; // default: "project-owner"
  includeDeleted?: boolean; // default: false
};

/**
 * Fetch list developer + status:
 * - user_auths.is_verified as ZK-KYC
 * - project_owners.is_verified as Manual KYC
 */
export function useDeveloperVerificationList(
  options: UseDeveloperVerificationListOptions = {}
) {
  const { role = "project-owner", includeDeleted = false } = options;

  const [data, setData] = useState<DevRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // NOTE: select join project_owners (assumes relationship exists)
    let query = supabase
      .from("user_auths")
      .select(
        `
        id,
        name,
        wallet_address,
        role,
        is_verified,
        deleted_at,
        project_owners (
          id,
          is_verified,
          tx_hash,
          deleted_at
        )
      `
      )
      .eq("role", role);

    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }

    const { data: rows, error: err } = await query;

    if (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
      return;
    }

    const mapped: DevRow[] =
      rows?.map((u: any) => {
        const po = (u.project_owners ?? [])
          .filter((x: any) => (includeDeleted ? true : x?.deleted_at == null))
          .at(0);

        return {
          id: u.id,
          name: u.name ?? null,
          wallet_address: u.wallet_address,
          role: u.role,
          zk_verified: Boolean(u.is_verified),
          manual_verified: Boolean(po?.is_verified),
          project_owner_id: po?.id ?? null,
          project_owner_tx_hash: po?.tx_hash ?? null,
        };
      }) ?? [];

    setData(mapped);
    setIsLoading(false);
  }, [role, includeDeleted]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pendingCount = useMemo(
    () => data.filter((d) => !(d.zk_verified && d.manual_verified)).length,
    [data]
  );

  return {
    devs: data,
    isLoading,
    error,
    pendingCount,
    refresh,
  };
}

type UseApproveDeveloperOptions = {
  registryAddress: `0x${string}`;
  // optional: enforce zk must be verified before manual approval
  requireZkVerified?: boolean; // default false
};

/**
 * Approve dev:
 * - call contract approveDeveloper(wallet)
 * - wait receipt
 * - update project_owners.is_verified=true + tx_hash
 */
export function useApproveDeveloper(opts: UseApproveDeveloperOptions) {
  const { registryAddress, requireZkVerified = false } = opts;

  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  const [syncingWallet, setSyncingWallet] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(
    async (dev: DevRow) => {
      setError(null);
      setLastTx(null);

      const fullyApproved = dev.zk_verified && dev.manual_verified;
      if (fullyApproved) return { ok: true as const, reason: "already-approved" };

      if (requireZkVerified && !dev.zk_verified) {
        return { ok: false as const, reason: "zk-not-verified" };
      }

      setSyncingWallet(dev.wallet_address);
      try {
        const hash = await writeContractAsync({
          address: registryAddress,
          abi: protocolAbi,
          functionName: "approveDeveloper",
          args: [dev.wallet_address as `0x${string}`],
        });

        await waitForTransactionReceipt(config, { hash });
        setLastTx(hash);

        // Update manual KYC flag in DB
        const { error: poErr } = await supabase
          .from("project_owners")
          .update({ is_verified: true, tx_hash: hash })
          .eq("user_auth_id", dev.id);

        if (poErr) {
          console.error(poErr);
          setError(poErr.message);
          return { ok: false as const, reason: "db-update-failed", tx: hash };
        }

        return { ok: true as const, tx: hash };
      } catch (e: any) {
        console.error(e);
        const msg =
          e?.shortMessage ||
          e?.message ||
          "Transaction failed / reverted. Check admin role.";
        setError(msg);
        return { ok: false as const, reason: "tx-failed" };
      } finally {
        setSyncingWallet(null);
      }
    },
    [config, registryAddress, requireZkVerified, writeContractAsync]
  );

  return {
    approve,
    syncingWallet, // for per-row loading state
    lastTx,
    error,
  };
}
