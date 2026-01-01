// reclaim-config.ts
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

export const getReclaimRequest = async () => {
  return await ReclaimProofRequest.init(
    import.meta.env.VITE_RECLAIM_APP_ID,
    import.meta.env.VITE_RECLAIM_APP_SECRET,
    import.meta.env.VITE_RECLAIM_PROVIDER_ID
  );
};