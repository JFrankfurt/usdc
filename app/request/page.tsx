"use client";
import YOU_OWE_ABI from "@/abi/youOwe";
import Button from "@/components/button";
import { YOU_OWE_ADDRESS } from "@/constants/addresses";
import { useCallback, useEffect, useState } from "react";
import { isAddress, parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { useWriteContract } from "wagmi";
import { useRouter } from "next/navigation";

export default function Request() {
  const [debtorAddress, setDebtorAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const {
    isPending: isCreateDebtLoading,
    isSuccess: isCreateDebtSuccessful,
    writeContract: createDebt,
  } = useWriteContract();

  const handleCreateRequestClick = useCallback(() => {
    if (
      !debtorAddress ||
      !amount ||
      !description ||
      !isAddress(debtorAddress)
    ) {
      console.error("All fields are required");
      return;
    }

    createDebt({
      chainId: baseSepolia.id,
      abi: YOU_OWE_ABI,
      address: YOU_OWE_ADDRESS[baseSepolia.id],
      functionName: "createDebt",
      args: [debtorAddress, parseEther(amount), description],
    });
  }, [debtorAddress, amount, description, createDebt]);

  const router = useRouter();
  useEffect(() => {
    if (isCreateDebtSuccessful) {
      const timer = setTimeout(() => router.push("/home"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCreateDebtSuccessful, router]);

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold mb-4">Create New Request</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="debtorAddress" className="block mb-2">
            Request money from:
          </label>
          <input
            id="debtorAddress"
            type="text"
            className="w-full p-2 border rounded"
            value={debtorAddress}
            onChange={(e) => setDebtorAddress(e.target.value)}
            placeholder="0x..."
          />
        </div>
        <div>
          <label htmlFor="amount" className="block mb-2">
            Amount:
          </label>
          <input
            id="amount"
            type="number"
            step="0.000000000000000001"
            className="w-full p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="$42"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2">
            Description:
          </label>
          <input
            id="description"
            type="text"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dinner bill"
          />
        </div>
        <Button
          onClick={handleCreateRequestClick}
          disabled={isCreateDebtLoading}
          className="bg-ocsblue text-white rounded hover:bg-ocsblue/60 disabled:bg-gray-400"
        >
          {isCreateDebtLoading ? "Sending..." : "Send Payment Request"}
        </Button>
      </div>
      {isCreateDebtSuccessful && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Success!
        </div>
      )}
    </div>
  );
}
