import { createPublicClient, webSocket } from "viem";
import { base } from "viem/chains";

export const USERNAME_DOMAINS: Record<number, string> = {
  [base.id]: "basetest.eth",
};

const alchemyAPIKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
export function getBasenamePublicClient(chainId: number) {
  const rpcEndpoint = `wss://base-sepolia.g.alchemy.com/v2/${alchemyAPIKey}`;

  return createPublicClient({
    chain: base,
    transport: webSocket(rpcEndpoint),
  });
}

export const supportedChainIds: number[] = [base.id];
export function isBasenameSupportedChain(chainId: number) {
  return supportedChainIds.includes(chainId);
}
