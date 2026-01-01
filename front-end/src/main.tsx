import '@rainbow-me/rainbowkit/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./output.css";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from "react-router";
import { WagmiProvider } from 'wagmi'
import { config } from './lib/chains/rainbowKitConfig';
import { normalizeError } from './lib/normalizeError';
import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        throw normalizeError(error);
      }
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RouterProvider router={router} />
        </RainbowKitProvider>
       </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
