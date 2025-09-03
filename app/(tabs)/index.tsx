// app/(tabs)/index.tsx
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome, {user ? user.email : 'Guest'}!
        </Text>
        {/* We will add PeriodSelector, IncomeList, BudgetList, etc. here later */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
  },
});