"use client";
import { useCallback } from "react";
import { useAccount, useConnect } from "wagmi";
import Button from "../button";
import { CoinbaseWalletLogo } from "./CoinbaseWalletLogo";
import { useRouter } from "next/navigation";

export default function SignInUI() {
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
  return (
    <Button
      className="flex flex-row justify-center items-center"
      onClick={createWallet}
    >
      <CoinbaseWalletLogo />
      Sign In / Create Account
    </Button>
  );
}
