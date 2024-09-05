import Cart from "@/app/icons/cart.svg";
import Star from "@/app/icons/star.svg";
import Account from "@/app/icons/user-circle.svg";
import Wallet from "@/app/icons/wallet.svg";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <nav className="flex flex-row items-center justify-around sticky bottom-0 py-3 bg-white">
      <Link
        href="/wallet"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Wallet} alt="banknotes" />
        Wallet
      </Link>
      <Link
        href="/reward"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Star} alt="banknotes" />
        Reward
      </Link>
      <Link
        href="/shop"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Cart} alt="banknotes" />
        Shop
      </Link>
      <Link
        href="/account"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Account} alt="banknotes" />
        Account
      </Link>
    </nav>
  );
}
