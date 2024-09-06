"use client";
import Button from "@/components/button";
import { CoinbaseWalletLogo } from "@/components/signIn/CoinbaseWalletLogo";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAccount, useConnect } from "wagmi";

export default function SignIn() {
  const router = useRouter();
  const account = useAccount();
  if (account.isConnected) {
    router.push("/home");
  }
  const { connectors, connect } = useConnect();
  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect(
        { connector: coinbaseWalletConnector },
        {
          onSuccess: () => {
            router.push("/home");
          },
        }
      );
    }
  }, [connectors, connect, router]);
  const connectInjected = useCallback(() => {
    const injectedConnector = connectors.find(
      (connector) => connector.id === "injected"
    );
    if (injectedConnector) {
      connect(
        { connector: injectedConnector },
        {
          onSuccess: () => {
            router.push("/home");
          },
        }
      );
    }
  }, [connectors, connect, router]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        className="flex flex-row justify-center items-center bg-ocsblue text-white gap-2"
        onClick={createWallet}
      >
        <CoinbaseWalletLogo />
        Sign In / Create Account
      </Button>
      <Button
        className="text-palette-foregroundMuted border rounded-xl"
        onClick={connectInjected}
      >
        injected
      </Button>
    </main>
  );
}
