import { createPublicClient, webSocket } from "viem";
import { baseSepolia } from "viem/chains";

export const USERNAME_DOMAINS: Record<number, string> = {
  [baseSepolia.id]: "basetest.eth",
};

const alchemyAPIKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
export function getBasenamePublicClient(chainId: number) {
  const rpcEndpoint = `wss://base-sepolia.g.alchemy.com/v2/${alchemyAPIKey}`;

  return createPublicClient({
    chain: baseSepolia,
    transport: webSocket(rpcEndpoint),
  });
}

export const supportedChainIds: number[] = [baseSepolia.id];
export function isBasenameSupportedChain(chainId: number) {
  return supportedChainIds.includes(chainId);
}
