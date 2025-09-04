// components/TransactionList.tsx
import { styles } from '@/styles/components/TransactionListStyles';
import { formatAmount } from '@/utils/formatters';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface TransactionItem {
  id: string;
  name: string;
  amount: number;
}

interface TransactionListProps {
  title: string;
  items: TransactionItem[];
  emptyMessage: string;
  onDelete: (id: string) => void;
  onAddItem?: () => void;
  addItemButtonText?: string;
}

export default function TransactionList({
  title,
  items,
  emptyMessage,
  onDelete,
  onAddItem,
  addItemButtonText,
}: TransactionListProps) {
  const renderItem = ({ item }: { item: TransactionItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.itemAmount}>{formatAmount(item.amount)}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
      {onAddItem && addItemButtonText && (
        <TouchableOpacity style={styles.addNewButton} onPress={onAddItem}>
          <Text style={styles.addNewButtonText}>{addItemButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}