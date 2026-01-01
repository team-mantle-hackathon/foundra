import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { mantleSepoliaTestnet, sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'LendingRWA',
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  chains: [mantleSepoliaTestnet],
  transports: {
      [mantleSepoliaTestnet.id]: http(import.meta.env.VITE_MANTLE_RPC_URL), 
    },
});