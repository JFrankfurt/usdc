"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "viem/chains";
import { formatEther, parseEther } from "viem";
import YOU_OWE_ABI from "@/abi/youOwe";
import { YOU_OWE_ADDRESS } from "@/constants/addresses";
import Button from "@/components/button";
import { useRouter } from "next/navigation";

type Debt = {
  id: bigint;
  creditor: `0x${string}`;
  debtor: `0x${string}`;
  amount: bigint;
  description: string;
};

export default function DebtManagement() {
  const [incomingDebts, setIncomingDebts] = useState<Debt[]>([]);
  const [outgoingDebts, setOutgoingDebts] = useState<Debt[]>([]);

  const { address, isConnected } = useAccount();
  const router = useRouter();
  if (!isConnected) {
    router.push("/sign-in");
  }
  const { data: incomingDebtsData, refetch: refetchIncoming } = useReadContract(
    {
      address: YOU_OWE_ADDRESS[base.id],
      abi: YOU_OWE_ABI,
      functionName: "getDebtsOwedTo",
      args: [address ?? "0x0"],
      query: { enabled: !!address },
    }
  );

  const { data: outgoingDebtsData, refetch: refetchOutgoing } = useReadContract(
    {
      address: YOU_OWE_ADDRESS[base.id],
      abi: YOU_OWE_ABI,
      functionName: "getDebtsOwedBy",
      args: [address ?? "0x0"],
      query: { enabled: !!address },
    }
  );

  const { writeContract: cancelDebt, data: cancelData } = useWriteContract();
  const { writeContract: settleDebt, data: settleData } = useWriteContract();
  const handleCancel = useCallback((debtId: bigint) => {
    cancelDebt({
      address: YOU_OWE_ADDRESS[base.id],
      abi: YOU_OWE_ABI,
      functionName: "cancelDebt",
      args: [debtId],
    });
  }, []);

  const handleSettle = useCallback((debtId: bigint, amount: bigint) => {
    settleDebt({
      address: YOU_OWE_ADDRESS[base.id],
      abi: YOU_OWE_ABI,
      functionName: "settleDebt",
      args: [debtId],
      value: amount,
    });
  }, []);

  // Wait for transactions
  const { isLoading: isCancelLoading, isSuccess: isCancelSuccess } =
    useWaitForTransactionReceipt({ hash: cancelData });

  const { isLoading: isSettleLoading, isSuccess: isSettleSuccess } =
    useWaitForTransactionReceipt({ hash: settleData });

  useEffect(() => {
    if (incomingDebtsData) {
      const mIncomingDebts = incomingDebtsData.map((debt) => ({ ...debt }));
      setIncomingDebts(mIncomingDebts);
    }
    if (outgoingDebtsData) {
      const mOutgoingDebts = outgoingDebtsData.map((debt) => ({ ...debt }));
      setOutgoingDebts(mOutgoingDebts);
    }
  }, [incomingDebtsData, outgoingDebtsData]);

  useEffect(() => {
    if (isCancelSuccess || isSettleSuccess) {
      refetchIncoming();
      refetchOutgoing();
    }
  }, [isCancelSuccess, isSettleSuccess, refetchIncoming, refetchOutgoing]);

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-72px)]">
      <h1 className="text-2xl font-bold mb-4">Pending Requests</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Received</h2>
        {incomingDebts.length === 0 ? (
          <p>No incoming requests.</p>
        ) : (
          <ul className="space-y-4">
            {incomingDebts.map((debt) => (
              <li key={debt.id.toString()} className="border p-4 rounded-md">
                <p>From: {debt.debtor}</p>
                <p>Amount: {formatEther(debt.amount)} ETH</p>
                <p>Description: {debt.description}</p>
                <Button
                  onClick={() => handleSettle(debt.id, debt.amount)}
                  disabled={isSettleLoading}
                  className="mt-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isSettleLoading ? "Paying..." : "Pay"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Requested</h2>
        {outgoingDebts.length === 0 ? (
          <p>No outgoing requests.</p>
        ) : (
          <ul className="space-y-4">
            {outgoingDebts.map((debt) => (
              <li key={debt.id.toString()} className="border p-4 rounded-md">
                <p>To: {debt.creditor}</p>
                <p>Amount: {formatEther(debt.amount)} ETH</p>
                <p>Description: {debt.description}</p>
                <Button
                  onClick={() => handleCancel(debt.id)}
                  disabled={isCancelLoading}
                  className="mt-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                >
                  {isCancelLoading ? "Cancelling..." : "Cancel"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
