import { useName } from "@coinbase/onchainkit/identity";
import { Address, isAddress } from "viem";
import { baseSepolia, mainnet } from "viem/chains";

/**
 * Convert an chainId to a coinType hex for reverse chain resolution
 */
export const convertChainIdToCoinType = (chainId: number): string => {
  // L1 resolvers to addr
  if (chainId === mainnet.id) {
    return "addr";
  }

  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};

export function useBasenameOfAddress(address: Address | undefined = "0x0") {
  return useName(
    {
      address: address,
      // @ts-ignore
      chain: baseSepolia,
    },
    {
      enabled: !!address && isAddress(address),
    }
  );
}
