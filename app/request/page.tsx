"use client";
import React, { useState, useEffect } from "react";
import USDC_ABI from "@/abi/usdc";
import Footer from "@/components/footer";
import Input from "@/components/input";
import { USDC } from "@/constants/tokens";
import { useUSDCBalance } from "@/hooks/useUSDCBalance";
import { useRouter } from "next/navigation";
import { Address, formatUnits, parseUnits } from "viem";
import { useAccount, useWriteContract, useEnsAddress, useEnsName } from "wagmi";
import Button from "@/components/button";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Button as HeadlessButton } from "@headlessui/react";
import classNames from "classnames";

export default function Send() {
  const { data: balance } = useUSDCBalance();
  const router = useRouter();
  const account = useAccount();
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContactPickerOpen, setIsContactPickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<
    Array<{ name: string; address: string }>
  >([]);

  const { writeContract, isPending: isTransactionLoading } = useWriteContract();
  const { data: ensAddress } = useEnsAddress({ name: searchTerm });
  const { data: ensName } = useEnsName({ address: searchTerm as Address });

  useEffect(() => {
    if (ensAddress || ensName) {
      setContacts([
        { name: ensName || searchTerm, address: ensAddress || searchTerm },
      ]);
    }
  }, [ensAddress, ensName, searchTerm]);

  if (!account.isConnected) {
    router.push("/sign-in");
  }

  const handleSend = async () => {
    try {
      setIsSending(true);
      setError(null);
      // Validate input
      if (!recipient || !amount || parseFloat(amount) <= 0) {
        throw new Error("Invalid recipient or amount");
      }
      const balanceInUnits = formatUnits(balance ?? 0n, USDC.decimals);
      if (parseFloat(amount) > parseFloat(balanceInUnits)) {
        throw new Error("Insufficient balance");
      }
      // Send the transaction
      writeContract({
        address: USDC.address as `0x${string}`,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [recipient as Address, parseUnits(amount || "0", USDC.decimals)],
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  const handleContactSelect = (contact: { name: string; address: string }) => {
    setRecipient(contact.address);
    setRecipientName(contact.name);
    setIsContactPickerOpen(false);
  };

  return (
    <div className="flex flex-col justify-start h-screen">
      <div className="flex-1">
        <p>todo:</p>
        <ol>
          <li>select a contact</li>
          <li>use payment request contract</li>
        </ol>
      </div>
      <Footer />
    </div>
  );
}
