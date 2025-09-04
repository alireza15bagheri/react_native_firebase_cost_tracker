// components/BudgetList.tsx
import { Budget } from '@/types/data';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BudgetListProps {
  budgets: Budget[];
  onDelete: (id: string) => void;
}

const formatAmount = (amount: number) => {
  // Round the number to the nearest whole number.
  const numAsString = Math.round(amount).toString();
  // Use a regular expression to insert commas as thousands separators from the right.
  return numAsString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function BudgetList({ budgets, onDelete }: BudgetListProps) {
  const renderItem = ({ item }: { item: Budget }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.rightContainer}>
        <Text style={styles.itemText}>{formatAmount(item.amount_allocated)}</Text>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budgets</Text>
      {budgets.length === 0 ? (
        <Text style={styles.emptyText}>No budgets added for this period.</Text>
      ) : (
        <FlatList
          data={budgets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: '#ff453a',
    fontSize: 18,
  },
});