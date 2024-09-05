"use client";
import { wagmiConfig } from "@/constants/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import SignIn from "@/components/signIn";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <SignIn />
        </QueryClientProvider>
      </WagmiProvider>
    </main>
  );
}
