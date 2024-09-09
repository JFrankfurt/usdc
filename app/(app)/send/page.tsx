"use client";
import USDC_ABI from "@/abi/usdc";
import Button from "@/components/button";
import Input from "@/components/input";
import { USDC } from "@/constants/tokens";
import { useUSDCBalance } from "@/hooks/useUSDCBalance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Address, formatUnits, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import {
  useAccount,
  useEnsAddress,
  useEnsName,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Send() {
  const { data: balance, refetch: refetchBalance } = useUSDCBalance();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isContactPickerOpen, setIsContactPickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 250);
  const [contacts, setContacts] = useState<
    Array<{ name: string; address: string }>
  >([]);

  const {
    writeContract,
    data: hash,
    isPending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { data: ensAddress } = useEnsAddress({ name: debouncedSearchTerm });
  const { data: ensName } = useEnsName({
    address: debouncedSearchTerm as Address,
  });

  useEffect(() => {
    if (ensAddress || ensName) {
      setContacts([
        {
          name: ensName || debouncedSearchTerm,
          address: ensAddress || debouncedSearchTerm,
        },
      ]);
    }
  }, [ensAddress, ensName, debouncedSearchTerm]);

  useEffect(() => {
    if (!isConnected) {
      router.push("/sign-in");
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (isConfirmed) {
      refetchBalance();
      setAmount("");
      setRecipient("");
      setRecipientName("");
    }
  }, [isConfirmed, refetchBalance]);

  const handleSend = async () => {
    setError(null);
    // Validate input
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      setError("Invalid recipient or amount");
      return;
    }
    const balanceInUnits = formatUnits(balance ?? 0n, USDC.decimals);
    if (parseFloat(amount) > parseFloat(balanceInUnits)) {
      setError("Insufficient balance");
      return;
    }
    // Send the transaction
    writeContract({
      chainId: baseSepolia.id,
      address: USDC.address as `0x${string}`,
      abi: USDC_ABI,
      functionName: "transfer",
      args: [recipient as Address, parseUnits(amount, USDC.decimals)],
    });
  };

  return (
    <div className="flex flex-col justify-start">
      <div className="flex flex-col mx-3 mt-12 gap-2">
        <p className="text-xs text-palette-foregroundMuted">
          Your cash balance
        </p>
        <p className="text-7xl">
          ${balance ? formatUnits(balance, USDC.decimals) : "--"}
        </p>
      </div>
      <div className="flex flex-col mx-3 mt-6 gap-4 flex-1">
        <Input
          type="text"
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border p-2 rounded"
        />
        <Input
          type="number"
          placeholder="Amount to Send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <Button
          onClick={handleSend}
          disabled={isPending || isConfirming}
          className="bg-ocsblue text-white"
        >
          {isPending ? "Approving..." : isConfirming ? "Confirming..." : "Send"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isWriteError && (
          <p className="text-red-500 mt-2">
            {writeError?.message || "Transaction failed"}
          </p>
        )}
        {isConfirmed && (
          <p className="text-green-500 mt-2">Transaction confirmed!</p>
        )}
      </div>

      {/* <Dialog
        open={isContactPickerOpen}
        onClose={() => setIsContactPickerOpen(false)}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-start justify-center p-4">
          <DialogPanel className="flex flex-col space-y-4 border bg-white p-12">
            <DialogTitle>Select Recipient</DialogTitle>
            <Input
              type="text"
              placeholder="basename or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded mb-4"
            />
            <div className="max-h-60 overflow-y-auto">
              {contacts.map((contact, index) => (
                <HeadlessButton
                  key={index}
                  onClick={() => handleContactSelect(contact)}
                  className="block w-full text-left p-2 hover:bg-gray-100"
                >
                  {contact.name} ({contact.address})
                </HeadlessButton>
              ))}
            </div>
            <Button
              onClick={() => setIsContactPickerOpen(false)}
              className="bg-ocsblue text-white flex-1"
            >
              close
            </Button>
          </DialogPanel>
        </div>
      </Dialog> */}
    </div>
  );
}
