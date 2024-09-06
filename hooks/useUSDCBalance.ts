import { useAccount, useReadContract } from "wagmi";
import { USDC } from "@/constants/tokens";
import USDC_ABI from "@/abi/usdc";

export function useUSDCBalance() {
  const { address } = useAccount();

  return useReadContract({
    address: USDC.address as `0x${string}`,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address || "0x0"],
    query: {
      enabled: !!address,
    },
  });
}
