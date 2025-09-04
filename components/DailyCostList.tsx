// components/DailyCostList.tsx
import { styles } from '@/styles/components/DailyCostListStyles';
import { DailyCost, Period } from '@/types/data';
import { formatAmount } from '@/utils/formatters';
import { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface DailyCostListProps {
  period: Period | undefined;
  dailyCosts: DailyCost[];
  onSetLimit: () => void;
  onAddCost: () => void;
  onDelete: (id: string) => void;
}

interface CalculatedCostItem extends DailyCost {
  carryOver: number;
  remaining: number;
}

export default function DailyCostList({
  period,
  dailyCosts,
  onSetLimit,
  onAddCost,
  onDelete,
}: DailyCostListProps) {
  const calculatedItems = useMemo((): CalculatedCostItem[] => {
    if (!period) return [];

    const sortedCosts = [...dailyCosts].sort((a, b) => a.date.localeCompare(b.date));
    const dailyLimit = period.daily_limit || 0;

    // Use reduce to handle the dependency between items
    return sortedCosts.reduce((acc, cost, index) => {
      // Get the remaining amount from the previous day, or 0 if it's the first day
      const previousDayRemaining = index > 0 ? acc[index - 1].remaining : 0;

      // New calculation for Carry Over, which is simply the previous day's remaining amount
      const carryOver = previousDayRemaining;

      // New calculation for Remaining
      const remaining = carryOver + dailyLimit - cost.spent;

      // Add the new calculated item to our accumulator array
      acc.push({
        ...cost,
        carryOver,
        remaining,
      });

      return acc;
    }, [] as CalculatedCostItem[]);
  }, [dailyCosts, period]);

  if (!period) {
    return null;
  }

  const renderItem = ({ item, index }: { item: CalculatedCostItem; index: number }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Date:</Text>
          <Text style={styles.itemValue}>{item.date}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Spent:</Text>
          <Text style={styles.itemValue}>{formatAmount(item.spent)}</Text>
        </View>
        {/* Only show Carry Over for days after the first day */}
        {index > 0 && (
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Carry Over:</Text>
            <Text style={styles.itemValue}>{formatAmount(item.carryOver)}</Text>
          </View>
        )}
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Remaining:</Text>
          <Text style={styles.itemValue}>{formatAmount(item.remaining)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily House Costs</Text>
        <TouchableOpacity style={styles.button} onPress={onSetLimit}>
          <Text style={styles.buttonText}>
            Limit: {formatAmount(period.daily_limit || 0)}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={calculatedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <TouchableOpacity style={styles.addNewButton} onPress={onAddCost}>
        <Text style={styles.addNewButtonText}>+ Add Daily Cost</Text>
      </TouchableOpacity>
    </View>
  );
}