import { useAuth } from '@/context/AuthContext';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DashboardHeaderProps {
  onAddIncome: () => void;
  onAddBudget: () => void;
  activePeriodId: string | null;
}

export default function DashboardHeader({
  onAddIncome,
  onAddBudget,
  activePeriodId,
}: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.welcomeUserText}>{user ? user.email : 'Guest'}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, !activePeriodId && styles.disabledButton]}
          disabled={!activePeriodId}
          onPress={onAddIncome}>
          <Text style={styles.actionButtonText}>+ Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, !activePeriodId && styles.disabledButton]}
          disabled={!activePeriodId}
          onPress={onAddBudget}>
          <Text style={styles.actionButtonText}>+ Add Budget</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#999',
  },
  welcomeUserText: {
    fontSize: 20,
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
});