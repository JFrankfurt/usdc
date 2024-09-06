import { Address } from "viem";
import { base, baseSepolia } from "viem/chains";

type AddressMap = Record<84532 | 8453, Address>;

export const YOU_OWE_ADDRESS: AddressMap = {
  [baseSepolia.id]: "0x0",
  [base.id]: "0x0",
};
