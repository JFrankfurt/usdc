import Friends from "@/app/icons/user.svg";
import Star from "@/app/icons/star.svg";
import Settings from "@/app/icons/cog.svg";
import Wallet from "@/app/icons/wallet.svg";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <nav className="flex flex-row items-center justify-around sticky bottom-0 py-3 bg-white">
      <Link
        href="/home"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Wallet} alt="Wallet" />
        Home
      </Link>
      <Link
        href="/reward"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Star} alt="Rewards" />
        Rewards
      </Link>
      <Link
        href="/friends"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Friends} alt="Friends" />
        Friends
      </Link>
      <Link
        href="/settings"
        className="flex flex-col items-center justify-between hover:bg-gray-10 bg-white transition-colors"
      >
        <Image src={Settings} alt="settings" />
        Settings
      </Link>
    </nav>
  );
}
