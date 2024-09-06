import { useAccount, useReadContract } from "wagmi";
import YOU_OWE_ABI from "@/abi/youOwe";
import { formatEther } from "viem";
import { baseSepolia } from "viem/chains";
import { YOU_OWE_ADDRESS } from "@/constants/addresses";

export default function PendingRequestsList() {
  const account = useAccount();

  const { data: debts } = useReadContract({
    address: YOU_OWE_ADDRESS[baseSepolia.id],
    chainId: baseSepolia.id,
    abi: YOU_OWE_ABI,
    functionName: "getDebtsOwedBy",
    args: [account.address ?? "0x0"],
    query: { enabled: !!account.address },
  });

  if (!debts || debts.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-4">
      {debts.map((debt) => (
        <li key={debt.id.toString()} className="border p-4 rounded-md">
          <p>
            <strong>Creditor:</strong> {debt.creditor}
          </p>
          <p>
            <strong>Amount:</strong> {formatEther(debt.amount)} ETH
          </p>
          <p>
            <strong>Description:</strong> {debt.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
