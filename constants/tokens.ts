import { Token } from "@uniswap/sdk-core";
import { base } from "wagmi/chains";

export const USDC = new Token(
  base.id,
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  6,
  "USDC",
  "USD Coin"
);
