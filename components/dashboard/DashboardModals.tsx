// components/dashboard/DashboardModals.tsx
import { Budget, DailyCost, Income, Period } from '@/types/data';
import { User } from 'firebase/auth';
import AddBudgetForm from '../forms/AddBudgetForm';
import AddDailyCostForm from '../forms/AddDailyCostForm';
import AddIncomeForm from '../forms/AddIncomeForm';
import AddPeriodForm from '../forms/AddPeriodForm';
import SetDailyLimitForm from '../forms/SetDailyLimitForm';
import AppModal from '../ui/AppModal';

interface DashboardModalsProps {
  modalVisible: 'period' | 'income' | 'budget' | 'dailyLimit' | 'dailyCost' | null;
  onClose: () => void;
  user: User | null;
  activePeriod: Period | undefined;
  onPeriodAdded: (period: Period) => void;
  onIncomeAdded: (income: Income) => void;
  onBudgetAdded: (budget: Budget) => void;
  onDailyCostAdded: (cost: DailyCost) => void;
  onSetDailyLimit: (periodId: string, limit: number) => Promise<void>;
}

export default function DashboardModals({
  modalVisible,
  onClose,
  user,
  activePeriod,
  onPeriodAdded,
  onIncomeAdded,
  onBudgetAdded,
  onDailyCostAdded,
  onSetDailyLimit,
}: DashboardModalsProps) {
  return (
    <AppModal visible={!!modalVisible} onClose={onClose}>
      {modalVisible === 'period' && user && (
        <AddPeriodForm userId={user.uid} onPeriodAdded={onPeriodAdded} onClose={onClose} />
      )}
      {modalVisible === 'income' && user && activePeriod && (
        <AddIncomeForm
          userId={user.uid}
          periodId={activePeriod.id}
          onIncomeAdded={onIncomeAdded}
          onClose={onClose}
        />
      )}
      {modalVisible === 'budget' && user && activePeriod && (
        <AddBudgetForm
          userId={user.uid}
          periodId={activePeriod.id}
          onBudgetAdded={onBudgetAdded}
          onClose={onClose}
        />
      )}
      {modalVisible === 'dailyLimit' && user && activePeriod && (
        <SetDailyLimitForm
          periodId={activePeriod.id}
          currentLimit={activePeriod.daily_limit || 0}
          onLimitSet={onSetDailyLimit}
          onClose={onClose}
        />
      )}
      {modalVisible === 'dailyCost' && user && activePeriod && (
        <AddDailyCostForm
          userId={user.uid}
          period={activePeriod}
          onCostAdded={onDailyCostAdded}
          onClose={onClose}
        />
      )}
    </AppModal>
  );
}