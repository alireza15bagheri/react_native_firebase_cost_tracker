// hooks/useDashboardData.ts
import { useAuth } from '@/context/AuthContext';
import {
  deleteBudget,
  deleteDailyCost,
  deleteIncome,
  deletePeriod,
  getBudgetsForPeriod,
  getDailyCostsForPeriod,
  getIncomesForPeriod,
  getPeriods,
  updatePeriodDailyLimit,
} from '@/lib/firebase-service';
import { Budget, DailyCost, Income, Period } from '@/types/data';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function useDashboardData() {
  const { user } = useAuth();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [activePeriodId, setActivePeriodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dailyCosts, setDailyCosts] = useState<DailyCost[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  useEffect(() => {
    if (user) {
      fetchPeriods();
    }
  }, [user]);
  useEffect(() => {
    if (user && activePeriodId) {
      fetchIncomesAndBudgets(activePeriodId);
    } else {
      setIncomes([]);
      setBudgets([]);
      setDailyCosts([]);
    }
  }, [user, activePeriodId]);
  const fetchPeriods = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userPeriods = (await getPeriods(user.uid)) as Period[];
      setPeriods(userPeriods);
      if (userPeriods.length > 0) {
        // Find if the active period still exists, otherwise default to the first
        const currentActiveExists = userPeriods.some((p) => p.id === activePeriodId);
        if (!currentActiveExists) {
          setActivePeriodId(userPeriods[0].id);
        }
      } else {
        setActivePeriodId(null);
      }
    } catch (error) {
      console.error('Failed to fetch periods:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchIncomesAndBudgets = async (periodId: string) => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [userIncomes, userBudgets, userDailyCosts] = await Promise.all([
        getIncomesForPeriod(user.uid, periodId),
        getBudgetsForPeriod(user.uid, periodId),
        getDailyCostsForPeriod(user.uid, periodId),
      ]);
      setIncomes(userIncomes as Income[]);
      setBudgets(userBudgets as Budget[]);
      setDailyCosts(userDailyCosts as DailyCost[]);
    } catch (error) {
      console.error('Failed to fetch incomes/budgets/costs:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSetDailyLimit = async (periodId: string, limit: number) => {
    try {
      await updatePeriodDailyLimit(periodId, limit);
      // Refetch periods to get the updated data
      await fetchPeriods();
      Alert.alert('Success', 'Daily limit updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update daily limit.');
      console.error(error);
    }
  };

  const handleDeletePeriod = async () => {
    if (!activePeriodId || !user) return;
    Alert.alert(
      'Delete Period',
      'Are you sure you want to delete this period? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePeriod(activePeriodId, user.uid);
              const remainingPeriods = periods.filter((p) => p.id !== activePeriodId);
              setPeriods(remainingPeriods);
              setActivePeriodId(remainingPeriods.length > 0 ? remainingPeriods[0].id : null);
              Alert.alert('Success', 'Period deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete period.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteIncome = (incomeId: string) => {
    Alert.alert('Delete Income', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteIncome(incomeId);
            setIncomes((prev) => prev.filter((i) => i.id !== incomeId));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete income.');
          }
        },
      },
    ]);
  };

  const handleDeleteBudget = (budgetId: string) => {
    Alert.alert('Delete Budget', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBudget(budgetId);
            setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete budget.');
          }
        },
      },
    ]);
  };

  const handleDeleteDailyCost = (costId: string) => {
    Alert.alert('Delete Daily Cost', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDailyCost(costId);
            setDailyCosts((prev) => prev.filter((c) => c.id !== costId));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete daily cost.');
          }
        },
      },
    ]);
  };

  return {
    user,
    periods,
    setPeriods,
    activePeriodId,
    setActivePeriodId,
    incomes,
    setIncomes,
    budgets,
    setBudgets,
    dailyCosts,
    setDailyCosts,
    loading,
    loadingData,
    handleSetDailyLimit,
    handleDeletePeriod,
    handleDeleteIncome,
    handleDeleteBudget,
    handleDeleteDailyCost,
  };
}