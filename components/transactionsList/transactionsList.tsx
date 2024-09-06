import { USDC } from "@/constants/tokens";
import { useEffect, useMemo, useState } from "react";
import { GetLogsReturnType, parseAbiItem, type Address } from "viem";
import { getLogs } from "viem/actions";
import { useAccount, useClient } from "wagmi";
import { ScrollArea } from "../ui/scroll-area";

export function TransactionsList() {
  const [sends, setSends] = useState<GetLogsReturnType | null>(null);
  const [receives, setReceives] = useState<GetLogsReturnType | null>(null);
  const client = useClient();
  const { address } = useAccount();
  console.log("jf address", address);
  console.log("jf client", client);
  useEffect(() => {
    if (!address || !client) return;

    async function fetchLogs() {
      try {
        // Fetch sent transactions (where `from` is the current user)
        // @ts-ignore
        const sendLogs = await getLogs(client, {
          address: USDC.address as Address,
          event: parseAbiItem(
            "event Transfer(address indexed from, address indexed to, uint256)"
          ),
          args: {
            from: address,
          },
          fromBlock: 2212480n,
        });

        console.log("jf sendLogs", sendLogs);

        // Fetch received transactions (where `to` is the current user)
        // @ts-ignore
        const receiveLogs = await getLogs(client, {
          address: USDC.address as Address,
          event: parseAbiItem(
            "event Transfer(address indexed from, address indexed to, uint256)"
          ),
          args: {
            to: address,
          },
          fromBlock: 2212480n,
        });
        console.log("jf receiveLogs", receiveLogs);

        // Set both states
        setSends(sendLogs);
        setReceives(receiveLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    fetchLogs().finally(() => {
      console.log("jf finally");
    });
  }, [address, client]);

  // Merge the send and receive transactions and sort them by blockNumber or timestamp
  const transactions = useMemo(() => {
    if (!sends && !receives) return [];

    const allTransactions = [...(sends || []), ...(receives || [])];

    // Sort transactions by block number (or other criteria if necessary)
    return allTransactions.sort(
      (a, b) => Number(a.blockNumber) - Number(b.blockNumber)
    );
  }, [sends, receives]);

  return (
    <ScrollArea>
      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        transactions.map((tx, index) => (
          <div key={tx.transactionHash || index}>
            <p>Transaction Hash: {tx.transactionHash}</p>
            {/* <p>From: {tx.args?.from}</p>
            <p>To: {tx.args?.to}</p>
            <p>Amount: {tx.args?.value.toString()}</p> */}
          </div>
        ))
      )}
    </ScrollArea>
  );
}
