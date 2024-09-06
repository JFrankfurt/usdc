import { TransactionsList } from "@/components/transactionsList/transactionsList";

export default function Transactions() {
  return (
    <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
      <TransactionsList />
    </div>
  );
}
