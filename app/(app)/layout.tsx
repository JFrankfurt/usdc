"use client";
import Footer from "@/components/footer";
import { wagmiConfig } from "@/constants/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="mb-20">{children}</div>
        <Footer />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
