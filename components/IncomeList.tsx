// components/IncomeList.tsx
import { Income } from '@/types/data';
import TransactionList from './TransactionList';

interface IncomeListProps {
  incomes: Income[];
  onDelete: (id: string) => void;
}

export default function IncomeList({ incomes, onDelete }: IncomeListProps) {
  const transactionItems = incomes.map((income) => ({
    id: income.id,
    name: income.source,
    amount: income.amount,
  }));

  return (
    <TransactionList
      title="Incomes"
      items={transactionItems}
      emptyMessage="No incomes added for this period."
      onDelete={onDelete}
    />
  );
}