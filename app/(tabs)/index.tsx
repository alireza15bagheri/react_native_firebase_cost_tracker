// app/(tabs)/index.tsx
import DailyCostList from '@/components/DailyCostList';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardModals from '@/components/dashboard/DashboardModals';
import PeriodManager from '@/components/dashboard/PeriodManager';
import { ThemedView } from '@/components/ThemedView';
import TransactionList from '@/components/TransactionList';
import { IconSymbol } from '@/components/ui/IconSymbol';
import useDashboardData from '@/hooks/useDashboardData';
import { styles } from '@/styles/screens/DashboardStyles';
import { formatAmount } from '@/utils/formatters';
import { getDaysInPeriod } from '@/utils/helpers';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<
    'period' | 'income' | 'budget' | 'dailyLimit' | 'dailyCost' | null
  >(null);

  const {
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
  } = useDashboardData();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ marginLeft: 15 }}>
          <IconSymbol name="line.3.horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Listens for the instruction from the drawer menu to open the 'New Period' modal
  useEffect(() => {
    if (params.openNewPeriodModal) {
      setModalVisible('period');
      router.setParams({ openNewPeriodModal: undefined });
    }
  }, [params]);

  const { activePeriod, remainderAmount, finalRemainder } = useMemo(() => {
    const period = periods.find((p) => p.id === activePeriodId);
    const tIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);
    const tBudgets = budgets.reduce((sum, budget) => sum + budget.amount_allocated, 0);
    const remainder = tIncomes - tBudgets;

    let final = remainder;
    if (period) {
      const daysInPeriod = getDaysInPeriod(period.start_date, period.end_date);
      const totalDailyLimit = (period.daily_limit || 0) * daysInPeriod;
      final = remainder - totalDailyLimit;
    }

    return {
      activePeriod: period,
      remainderAmount: remainder,
      finalRemainder: final,
    };
  }, [incomes, budgets, periods, activePeriodId]);

  return (
    <ThemedView style={styles.safeArea}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <DashboardHeader
            activePeriodId={activePeriodId}
            onAddIncome={() => setModalVisible('income')}
            onAddBudget={() => setModalVisible('budget')}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <>
              <PeriodManager
                periods={periods}
                activePeriodId={activePeriodId}
                onPeriodChange={setActivePeriodId}
                onDeletePeriod={handleDeletePeriod}
              />

              {loadingData ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
              ) : (
                activePeriodId && (
                  <>
                    <TransactionList
                      title="Incomes"
                      items={incomes.map((i) => ({ id: i.id, name: i.source, amount: i.amount }))}
                      emptyMessage="No incomes added for this period."
                      onDelete={handleDeleteIncome}
                    />
                    <TransactionList
                      title="Budgets"
                      items={budgets.map((b) => ({
                        id: b.id,
                        name: b.name,
                        amount: b.amount_allocated,
                      }))}
                      emptyMessage="No budgets added for this period."
                      onDelete={handleDeleteBudget}
                    />
                    <View style={styles.summaryContainer}>
                      <Text style={styles.summaryText}>Remaining after Budgets Costs:</Text>
                      <Text
                        style={[
                          styles.summaryAmount,
                          { color: remainderAmount >= 0 ? '#4caf50' : '#f44336' },
                        ]}>
                        {formatAmount(remainderAmount)}
                      </Text>
                    </View>

                    <DailyCostList
                      period={activePeriod}
                      dailyCosts={dailyCosts}
                      onSetLimit={() => setModalVisible('dailyLimit')}
                      onAddCost={() => setModalVisible('dailyCost')}
                      onDelete={handleDeleteDailyCost}
                    />

                    <View style={styles.summaryContainer}>
                      <Text style={styles.summaryText}>Remaining after Daily Costs:</Text>
                      <Text
                        style={[
                          styles.summaryAmount,
                          { color: finalRemainder >= 0 ? '#4caf50' : '#f44336' },
                        ]}>
                        {formatAmount(finalRemainder)}
                      </Text>
                    </View>
                  </>
                )
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <DashboardModals
        modalVisible={modalVisible}
        onClose={() => setModalVisible(null)}
        user={user}
        activePeriod={activePeriod}
        onPeriodAdded={(newPeriod) => {
          setPeriods((prev) => [...prev, newPeriod]);
          setActivePeriodId(newPeriod.id);
        }}
        onIncomeAdded={(newIncome) => {
          setIncomes((prev) => [...prev, newIncome]);
        }}
        onBudgetAdded={(newBudget) => {
          setBudgets((prev) => [...prev, newBudget]);
        }}
        onDailyCostAdded={(newCost) => {
          setDailyCosts((prev) => [...prev, newCost]);
        }}
        onSetDailyLimit={handleSetDailyLimit}
      />
    </ThemedView>
  );
}