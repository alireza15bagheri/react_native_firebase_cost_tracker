// hooks/useDashboardData.ts
import { useAuth } from '@/context/AuthContext';
import {
  deleteBudget,
  deleteDailyCost,
  deleteIncome,
  deleteMiscellaneousCost,
  deletePeriod,
  getBudgetsForPeriod,
  getDailyCostsForPeriod,
  getIncomesForPeriod,
  getMiscellaneousCostsForPeriod,
  getPeriods,
  updatePeriodDailyLimit,
  updatePeriodNotes,
} from '@/lib/firebase-service';
import { Budget, DailyCost, Income, MiscellaneousCost, Period } from '@/types/data';
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
  const [miscellaneousCosts, setMiscellaneousCosts] = useState<MiscellaneousCost[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  useEffect(() => {
    if (user) {
      fetchPeriods();
    }
  }, [user]);
  useEffect(() => {
    if (user && activePeriodId) {
      fetchPeriodData(activePeriodId);
    } else {
      setIncomes([]);
      setBudgets([]);
      setDailyCosts([]);
      setMiscellaneousCosts([]);
    }
  }, [user, activePeriodId]);
  const fetchPeriods = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userPeriods = (await getPeriods(user.uid)) as Period[];
      setPeriods(userPeriods);
      if (userPeriods.length > 0) {
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
  const fetchPeriodData = async (periodId: string) => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [userIncomes, userBudgets, userDailyCosts, userMiscCosts] = await Promise.all([
        getIncomesForPeriod(user.uid, periodId),
        getBudgetsForPeriod(user.uid, periodId),
        getDailyCostsForPeriod(user.uid, periodId),
        getMiscellaneousCostsForPeriod(user.uid, periodId),
      ]);
      setIncomes(userIncomes as Income[]);
      setBudgets(userBudgets as Budget[]);
      setDailyCosts(userDailyCosts as DailyCost[]);
      setMiscellaneousCosts(userMiscCosts as MiscellaneousCost[]);
    } catch (error) {
      console.error('Failed to fetch period data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSetDailyLimit = async (periodId: string, limit: number) => {
    try {
      await updatePeriodDailyLimit(periodId, limit);
      await fetchPeriods();
      Alert.alert('Success', 'Daily limit updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update daily limit.');
      console.error(error);
    }
  };

  const handleSaveNotes = async (periodId: string, notes: string) => {
    try {
      await updatePeriodNotes(periodId, notes);
      await fetchPeriods(); // Refetch to ensure local data is up-to-date
      Alert.alert('Success', 'Notes saved successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save notes.');
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

  const handleDeleteMiscellaneousCost = (costId: string) => {
    Alert.alert('Delete Miscellaneous Cost', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMiscellaneousCost(costId);
            setMiscellaneousCosts((prev) => prev.filter((c) => c.id !== costId));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete miscellaneous cost.');
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
    miscellaneousCosts,
    setMiscellaneousCosts,
    loading,
    loadingData,
    handleSetDailyLimit,
    handleSaveNotes,
    handleDeletePeriod,
    handleDeleteIncome,
    handleDeleteBudget,
    handleDeleteDailyCost,
    handleDeleteMiscellaneousCost,
  };
}