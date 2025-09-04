// app/(tabs)/index.tsx
import BudgetList from '@/components/BudgetList';
import AddBudgetForm from '@/components/forms/AddBudgetForm';
import AddIncomeForm from '@/components/forms/AddIncomeForm';
import AddPeriodForm from '@/components/forms/AddPeriodForm';
import IncomeList from '@/components/IncomeList';
import { ThemedView } from '@/components/ThemedView';
import AppModal from '@/components/ui/AppModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/context/AuthContext';
import {
  deleteBudget,
  deleteIncome,
  deletePeriod,
  getBudgetsForPeriod,
  getIncomesForPeriod,
  getPeriods,
} from '@/lib/firebase-service';
import { Budget, Income, Period } from '@/types/data';
import { Picker } from '@react-native-picker/picker';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [periods, setPeriods] = useState<Period[]>([]);
  const [activePeriodId, setActivePeriodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState<'period' | 'income' | 'budget' | null>(null);

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loadingData, setLoadingData] = useState(false);

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

  // This effect listens for the instruction from the drawer menu
  useEffect(() => {
    if (params.openNewPeriodModal) {
      setModalVisible('period');
      // **THE FIX**: Clear the parameter immediately after using it.
      router.setParams({ openNewPeriodModal: undefined });
    }
  }, [params]);

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
    }
  }, [user, activePeriodId]);

  const fetchPeriods = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userPeriods = (await getPeriods(user.uid)) as Period[];
      setPeriods(userPeriods);
      if (userPeriods.length > 0 && !activePeriodId) {
        setActivePeriodId(userPeriods[0].id);
      } else if (userPeriods.length === 0) {
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
      const [userIncomes, userBudgets] = await Promise.all([
        getIncomesForPeriod(user.uid, periodId),
        getBudgetsForPeriod(user.uid, periodId),
      ]);
      setIncomes(userIncomes as Income[]);
      setBudgets(userBudgets as Budget[]);
    } catch (error) {
      console.error('Failed to fetch incomes/budgets:', error);
    } finally {
      setLoadingData(false);
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

  const activePeriod = periods.find((p) => p.id === activePeriodId);

  return (
    <ThemedView style={styles.safeArea}>
      <SafeAreaView>
        <ScrollView style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.welcomeUserText}>{user ? user.email : 'Guest'}</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, !activePeriodId && styles.disabledButton]}
                  disabled={!activePeriodId}
                  onPress={() => setModalVisible('income')}>
                  <Text style={styles.actionButtonText}>+ Add Income</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, !activePeriodId && styles.disabledButton]}
                  disabled={!activePeriodId}
                  onPress={() => setModalVisible('budget')}>
                  <Text style={styles.actionButtonText}>+ Add Budget</Text>
                </TouchableOpacity>
              </View>

              {periods.length > 0 && activePeriodId ? (
                <View style={styles.periodSelectorContainer}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={activePeriodId}
                      onValueChange={(itemValue) => setActivePeriodId(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}>
                      {periods.map((period) => (
                        <Picker.Item key={period.id} label={period.name} value={period.id} />
                      ))}
                    </Picker>
                  </View>
                  {activePeriod && (
                    <Text style={styles.periodDateText}>
                      {activePeriod.start_date} - {activePeriod.end_date}
                    </Text>
                  )}
                  <TouchableOpacity onPress={handleDeletePeriod} style={styles.deletePeriodButton}>
                    <Text style={styles.deletePeriodButtonText}>Delete Period</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  No periods found. Use the side menu to add one.
                </Text>
              )}

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

      {/* Modals for adding data */}
      <AppModal visible={!!modalVisible} onClose={() => setModalVisible(null)}>
        {modalVisible === 'period' && user && (
          <AddPeriodForm
            userId={user.uid}
            onPeriodAdded={(newPeriod) => {
              setPeriods((prev) => [...prev, newPeriod]);
              setActivePeriodId(newPeriod.id);
            }}
            onClose={() => setModalVisible(null)}
          />
        )}
        {modalVisible === 'income' && user && activePeriodId && (
          <AddIncomeForm
            userId={user.uid}
            periodId={activePeriodId}
            onIncomeAdded={(newIncome) => {
              setIncomes((prev) => [...prev, newIncome]);
            }}
            onClose={() => setModalVisible(null)}
          />
        )}
        {modalVisible === 'budget' && user && activePeriodId && (
          <AddBudgetForm
            userId={user.uid}
            periodId={activePeriodId}
            onBudgetAdded={(newBudget) => {
              setBudgets((prev) => [...prev, newBudget]);
            }}
            onClose={() => setModalVisible(null)}
          />
        )}
      </AppModal>
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
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#999',
  },
  welcomeUserText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  periodSelectorContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
  picker: {
    color: '#fff',
  },
  pickerItem: {
    color: '#fff',
    backgroundColor: '#1e1e1e',
  },
  periodDateText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  deletePeriodButton: {
    backgroundColor: '#ff453a',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  deletePeriodButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
});