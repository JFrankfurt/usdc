"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import StarSvg from "@/app/icons/star-solid.svg";
import EarnMoreSvg from "@/app/icons/earn-more.svg";
import Footer from "@/components/footer";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { TransactionsList } from "@/components/transactionsList/transactionsList";

export default function Home() {
  const balance = "10.00";
  const yieldEarned = "10.00";
  const router = useRouter();
  const account = useAccount();
  if (!account.isConnected) {
    router.push("/sign-in");
  }
  return (
    <div className="flex flex-col justify-start h-screen">
      <div className="flex flex-col mx-3 mt-12 gap-2">
        <p className="text-xs text-palette-foregroundMuted">Cash balance</p>
        <p className="text-7xl">${balance}</p>
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
      <div className="rounded-xl bg-palette-backgroundAlternate mx-3 p-3 flex flex-col items-start">
        <div className="rounded-full bg-ocsblue fill-white stroke-white flex-0 p-2">
          <Image
            src={StarSvg}
            alt="star in circle"
            style={{ stroke: "white", fill: "white" }}
          />
        </div>
        <p className="text-palette-foreground">${yieldEarned}</p>
        <p className="text-palette-foregroundMuted">Rewards earned</p>
      </div>
      <div className="flex-grow">
        <div className="flex flex-row items-center justify-between mx-4">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <Link href="/transactions" className="text-ocsblue hover:underline">
            See all
          </Link>
        </div>
        <TransactionsList />
      </div>
      <div className="flex flex-row justify-around items-center gap-4 mx-4">
        <Link
          href="/send"
          className="py-2 px-3 bg-ocsblue text-white rounded-full flex-grow flex items-center flex-row justify-center font-semibold"
        >
          Send
        </Link>
        <Link
          href="/receive"
          className="py-2 px-3 bg-ocsblue text-white rounded-full flex-grow flex items-center flex-row justify-center font-semibold"
        >
          Receive
        </Link>
      </div>
      <Footer />
    </div>
  );
}
