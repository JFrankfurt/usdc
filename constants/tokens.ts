import { Token } from "@uniswap/sdk-core";
import { baseSepolia } from "wagmi/chains";

export const USDC = new Token(
  baseSepolia.id,
  "0x4c88E442B9A2eF7bd918E637E70Bb4F23C71A073",
  6,
  "USDC",
  "USD Coin"
);
