"use client";

import MagnifyingGlass from "@/app/icons/magnifying-glass.svg";
import Input from "@/components/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useBaseEnsAvatar from "@/hooks/useBaseEnsAvatar";
import {
  useBasenameOfAddress,
  USERNAME_L2_RESOLVER_ADDRESSES,
} from "@/hooks/useBasenameOfAddress";
import { Basename } from "@coinbase/onchainkit/identity";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Address, isAddress } from "viem";
import { baseSepolia } from "viem/chains";
import { useEnsAddress } from "wagmi";
import { normalize } from "viem/ens";

interface ResultItemProps {
  name?: string;
  address: string;
}

const ResultItem: React.FC<ResultItemProps> = ({ name, address }) => (
  <div className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg">
    <Avatar>
      <AvatarImage
        src={`https://effigy.im/a/${address}.svg`}
        alt={name || address}
      />
      <AvatarFallback>
        {name ? name[0].toUpperCase() : address.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
    <div>
      {name && <p className="font-medium">{name}</p>}
      <p className="text-sm text-gray-500">{address}</p>
    </div>
  </div>
);

export default function Friends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 300);
  const normalizedSearchTerm = useMemo(() => {
    try {
      return normalize(debouncedSearchTerm);
    } catch (e) {
      return "";
    }
  }, []);
  const [lookupType, setLookupType] = useState<"name" | "address">("name");
  const addressLookup = useMemo(() => lookupType === "address", []);
  useEffect(() => {
    if (
      debouncedSearchTerm.startsWith("0x") &&
      isAddress(debouncedSearchTerm)
    ) {
      setLookupType("address");
    } else {
      setLookupType("name");
    }
  }, [debouncedSearchTerm]);

  const { data: foundBasename } = useBasenameOfAddress(
    addressLookup ? (debouncedSearchTerm as Address) : undefined
  );
  const { data: foundAddress } = useEnsAddress({
    chainId: baseSepolia.id,
    name: normalizedSearchTerm,
    universalResolverAddress: USERNAME_L2_RESOLVER_ADDRESSES[baseSepolia.id],
    query: { enabled: !!normalizedSearchTerm && lookupType === "name" },
  });
  const { data: foundAvatar } = useBaseEnsAvatar(
    foundBasename ?? normalizedSearchTerm
  );
  console.log("jf foundBasename", foundBasename);
  console.log("jf foundAvatar", foundAvatar);
  console.log("jf foundAddress", foundAddress);
  return (
    <div className="flex flex-col h-screen p-4">
      <div className="relative mb-4">
        <Image
          src={MagnifyingGlass}
          alt="magnifying glass"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          placeholder="Name, name.base.eth, name.eth"
          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col flex-1 space-y-2 mb-4">
        {Boolean(foundBasename || foundAddress) && (
          <ResultItem
            name={foundBasename ?? normalizedSearchTerm}
            address={foundAddress ?? normalizedSearchTerm}
          />
        )}
      </div>
    </div>
  );
}
