import { CLOUDFARE_IPFS_PROXY } from "@/constants/urls";
import { baseSepolia } from "viem/chains";
import { useEnsAvatar } from "wagmi";
import { USERNAME_L2_RESOLVER_ADDRESSES } from "./useBasenameOfAddress";

export default function useBaseEnsAvatar(name: string) {
  return useEnsAvatar({
    name: name,
    chainId: baseSepolia.id,
    universalResolverAddress: USERNAME_L2_RESOLVER_ADDRESSES[baseSepolia.id],
    assetGatewayUrls: {
      ipfs: CLOUDFARE_IPFS_PROXY,
    },
    query: {
      retry: false,
      enabled: !!name,
    },
  });
}
