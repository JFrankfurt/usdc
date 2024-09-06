import L2ResolverAbi from "@/abi/basenamesL2Resolver";
import { Address, encodePacked, keccak256, namehash } from "viem";
import { base, baseSepolia, mainnet } from "viem/chains";
import { useChainId, useReadContract } from "wagmi";

type AddressMap = Record<number, Address>;

export const USERNAME_L2_RESOLVER_ADDRESSES: AddressMap = {
  [baseSepolia.id]: "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA",
  [base.id]: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD",
};

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
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(baseSepolia.id);
  const baseReverseNode = namehash(
    `${chainCoinType.toLocaleUpperCase()}.reverse`
  );
  const addressReverseNode = keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
  );
  const chainId = useChainId();
  return useReadContract({
    chainId: baseSepolia.id,
    abi: L2ResolverAbi,
    address: USERNAME_L2_RESOLVER_ADDRESSES[chainId],
    functionName: "name",
    args: [addressReverseNode],
    query: {
      enabled: !!address,
    },
  });
}
