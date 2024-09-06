import { Address } from "viem";
import { base, baseSepolia } from "viem/chains";

type AddressMap = Record<84532 | 8453, Address>;

export const YOU_OWE_ADDRESS: AddressMap = {
  [baseSepolia.id]: "0x038c26c8F42e53685ae2b44aeF22A227DB432B56",
  [base.id]: "0x0",
};

export const BASE_FRIENDS_ADDRESS: AddressMap = {
  [baseSepolia.id]: "0x128aa5d8dad4148a8eb1f5aebda0e0a62510b87e",
  [base.id]: "0x0",
};

export const USERNAME_L2_RESOLVER_ADDRESSES: AddressMap = {
  [baseSepolia.id]: "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA",
  [base.id]: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD",
};
