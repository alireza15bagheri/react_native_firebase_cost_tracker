// components/IncomeList.tsx
import { Income } from '@/types/data';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IncomeListProps {
  incomes: Income[];
  onDelete: (id: string) => void;
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function IncomeList({ incomes, onDelete }: IncomeListProps) {
  const renderItem = ({ item }: { item: Income }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.source}</Text>
      <View style={styles.rightContainer}>
        <Text style={styles.itemText}>{formatAmount(item.amount)}</Text>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incomes</Text>
      {incomes.length === 0 ? (
        <Text style={styles.emptyText}>No incomes added for this period.</Text>
      ) : (
        <FlatList
          data={incomes}
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
    alignItems: 'center',
    paddingVertical: 15,
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