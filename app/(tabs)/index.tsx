// app/(tabs)/index.tsx
import BudgetList from '@/components/BudgetList';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardModals from '@/components/dashboard/DashboardModals';
import PeriodManager from '@/components/dashboard/PeriodManager';
import IncomeList from '@/components/IncomeList';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import useDashboardData from '@/hooks/useDashboardData';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState<'period' | 'income' | 'budget' | null>(null);

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
    loading,
    loadingData,
    handleDeletePeriod,
    handleDeleteIncome,
    handleDeleteBudget,
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

  return (
    <ThemedView style={styles.safeArea}>
      <SafeAreaView>
        <ScrollView style={styles.container}>
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
                    <IncomeList incomes={incomes} onDelete={handleDeleteIncome} />
                    <BudgetList budgets={budgets} onDelete={handleDeleteBudget} />
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
        activePeriodId={activePeriodId}
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
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    height: '100%',
    padding: 20,
  },
});