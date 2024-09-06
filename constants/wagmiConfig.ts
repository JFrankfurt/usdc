import { createConfig, webSocket } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

const alchemyAPIKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
if (!alchemyAPIKey) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_KEY is required");
}
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    // [base.id]: webSocket(
    //   `wss://base-mainnet.g.alchemy.com/v2/${alchemyAPIKey}`
    // ),
    [baseSepolia.id]: webSocket(
      `wss://base-sepolia.g.alchemy.com/v2/${alchemyAPIKey}`
    ),
  },
  connectors: [
    injected(),
    coinbaseWallet({ appName: "USDC", preference: "smartWalletOnly" }),
  ],
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
