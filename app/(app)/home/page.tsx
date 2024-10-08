"use client";

import EarnMoreSvg from "@/app/icons/earn-more.svg";
import PendingRequestsList from "@/components/pendingRequestsList";
import { TransactionsList } from "@/components/transactionsList/transactionsList";
import { USDC } from "@/constants/tokens";
import { useBasenameOfAddress } from "@/hooks/useBasenameOfAddress";
import { useUSDCBalance } from "@/hooks/useUSDCBalance";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

export default function Home() {
  const { data: balance } = useUSDCBalance();
  const router = useRouter();
  const account = useAccount();
  if (!account.isConnected) {
    router.push("/sign-in");
  }
  const { data: basename } = useBasenameOfAddress(account.address);
  return (
    <>
      <div className="flex flex-1 flex-col justify-start">
        <div className="flex flex-col mx-3 mt-8 gap-2">
          <div>
            {!!basename && (
              <p className=" text-palette-foreground">{basename}</p>
            )}
            <p className="text-xs ml-1 text-palette-foregroundMuted">
              Cash balance
            </p>
          </div>
          <p className="text-7xl">
            ${balance ? formatUnits(balance, USDC.decimals) : "0"}
          </p>
        </div>
        <div className="flex flex-row gap-3 items-center mx-8 my-4">
          <div>
            <b>Want to earn more?</b>
            <p className="text-palette-foregroundMuted text-sm">
              Add money and start earning 5% yield on your funds
            </p>
          </div>
          <Image src={EarnMoreSvg} alt="earn more filler" />
        </div>

        <div className="flex flex-row items-center justify-between mx-4">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <Link href="/transactions" className="text-ocsblue hover:underline">
            See all
          </Link>
        </div>
        <div className="flex-1">
          <PendingRequestsList />
          <TransactionsList />
        </div>
      </div>
      <div className="fixed bottom-20 right-0 left-0 flex flex-row justify-around items-center gap-4 mx-4">
        <Link
          href="/send"
          className="py-2 px-3 bg-ocsblue text-white rounded-full flex-grow flex items-center flex-row justify-center font-semibold w-1/3"
        >
          Send
        </Link>
        <Link
          href="/request"
          className="py-2 px-3 bg-ocsblue text-white rounded-full flex-grow flex items-center flex-row justify-center font-semibold w-1/3"
        >
          Request
        </Link>
      </div>
    </>
  );
}
