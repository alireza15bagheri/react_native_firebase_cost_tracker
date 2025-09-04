// components/dashboard/DashboardModals.tsx
import { Budget, Income, Period } from '@/types/data';
import { User } from 'firebase/auth';
import AddBudgetForm from '../forms/AddBudgetForm';
import AddIncomeForm from '../forms/AddIncomeForm';
import AddPeriodForm from '../forms/AddPeriodForm';
import AppModal from '../ui/AppModal';

interface DashboardModalsProps {
  modalVisible: 'period' | 'income' | 'budget' | null;
  onClose: () => void;
  user: User | null;
  activePeriodId: string | null;
  onPeriodAdded: (period: Period) => void;
  onIncomeAdded: (income: Income) => void;
  onBudgetAdded: (budget: Budget) => void;
}

export default function DashboardModals({
  modalVisible,
  onClose,
  user,
  activePeriodId,
  onPeriodAdded,
  onIncomeAdded,
  onBudgetAdded,
}: DashboardModalsProps) {
  return (
    <AppModal visible={!!modalVisible} onClose={onClose}>
      {modalVisible === 'period' && user && (
        <AddPeriodForm userId={user.uid} onPeriodAdded={onPeriodAdded} onClose={onClose} />
      )}
      {modalVisible === 'income' && user && activePeriodId && (
        <AddIncomeForm
          userId={user.uid}
          periodId={activePeriodId}
          onIncomeAdded={onIncomeAdded}
          onClose={onClose}
        />
      )}
      {modalVisible === 'budget' && user && activePeriodId && (
        <AddBudgetForm
          userId={user.uid}
          periodId={activePeriodId}
          onBudgetAdded={onBudgetAdded}
          onClose={onClose}
        />
      )}
    </AppModal>
  );
}