"use client";
import { USDC } from "@/constants/tokens";
import { useEffect, useMemo, useState } from "react";
import {
  formatUnits,
  GetLogsReturnType,
  Log,
  parseAbiItem,
  type Address,
} from "viem";
import { getLogs } from "viem/actions";
import { useAccount, useClient } from "wagmi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { baseSepolia } from "viem/chains";

interface TransactionLog extends Log<bigint, number, false> {
  args?: {
    from: Address;
    to: Address;
    value: bigint;
  };
}
type Transaction = TransactionLog & { type: "send" | "receive" };
export function TransactionsList() {
  const [sends, setSends] = useState<GetLogsReturnType | null>(null);
  const [receives, setReceives] = useState<GetLogsReturnType | null>(null);
  const client = useClient({ chainId: baseSepolia.id });
  const { address } = useAccount();

  useEffect(() => {
    if (!address || !client) return;
    async function fetchLogs() {
      try {
        const [sendLogs, receiveLogs] = await Promise.all([
          getLogs(client, {
            address: USDC.address as Address,
            event: parseAbiItem(
              "event Transfer(address indexed from, address indexed to, uint256 value)"
            ),
            args: { from: address },
            fromBlock: 2212480n,
          }),
          getLogs(client, {
            address: USDC.address as Address,
            event: parseAbiItem(
              "event Transfer(address indexed from, address indexed to, uint256 value)"
            ),
            args: { to: address },
            fromBlock: 2212480n,
          }),
        ]);
        setSends(sendLogs);
        setReceives(receiveLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    fetchLogs();
  }, [address, client]);

  const transactions = useMemo(() => {
    if (!sends && !receives) return [];
    const allTransactions = [
      ...(sends?.map((tx) => ({ ...tx, type: "send" as const })) || []),
      ...(receives?.map((tx) => ({ ...tx, type: "receive" as const })) || []),
    ] as Transaction[];
    return allTransactions.sort(
      (a, b) => Number(b.blockNumber) - Number(a.blockNumber)
    );
  }, [sends, receives]);

  return (
    <div className="w-full">
      <ScrollArea>
        {transactions.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No transactions found
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {transactions.map((tx, index) => {
              const isSent = tx.args?.from === address;
              return (
                <li key={tx.transactionHash || index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-1 rounded-full text-white ${
                          isSent ? "bg-palette-negative" : "bg-palette-positive"
                        }`}
                      >
                        {isSent ? "->" : "<-"}
                      </div>
                      <div>
                        <p className="font-medium">
                          {isSent ? "Sent" : "Received"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isSent &&
                            `To: ${tx.args?.to.slice(
                              0,
                              6
                            )}...${tx.args?.to.slice(-4)}`}
                          {!isSent &&
                            tx.args?.from &&
                            `From: ${tx.args?.from.slice(
                              0,
                              6
                            )}...${tx.args?.from.slice(-4)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          isSent ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isSent ? "-" : "+"}
                        {formatUnits(tx.args?.value ?? 0n, 6)} USDC
                      </p>
                      <p className="text-sm text-gray-500">
                        Tx: {tx.transactionHash?.slice(0, 6)}...
                        {tx.transactionHash?.slice(-4)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
