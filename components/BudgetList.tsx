// components/BudgetList.tsx
import { Budget } from '@/types/data';
import TransactionList from './TransactionList';

interface BudgetListProps {
  budgets: Budget[];
  onDelete: (id: string) => void;
}

export default function BudgetList({ budgets, onDelete }: BudgetListProps) {
  const transactionItems = budgets.map((budget) => ({
    id: budget.id,
    name: budget.name,
    amount: budget.amount_allocated,
  }));

  return (
    <TransactionList
      title="Budgets"
      items={transactionItems}
      emptyMessage="No budgets added for this period."
      onDelete={onDelete}
    />
  );
}