import { Period } from '@/types/data';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PeriodManagerProps {
  periods: Period[];
  activePeriodId: string | null;
  onPeriodChange: (id: string | null) => void;
  onDeletePeriod: () => void;
}

export default function PeriodManager({
  periods,
  activePeriodId,
  onPeriodChange,
  onDeletePeriod,
}: PeriodManagerProps) {
  const activePeriod = periods.find((p) => p.id === activePeriodId);

  if (periods.length === 0) {
    return <Text style={styles.emptyText}>No periods found. Use the side menu to add one.</Text>;
  }

  return (
    <View style={styles.periodSelectorContainer}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={activePeriodId}
          onValueChange={(itemValue) => onPeriodChange(itemValue)}
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
      <TouchableOpacity onPress={onDeletePeriod} style={styles.deletePeriodButton}>
        <Text style={styles.deletePeriodButtonText}>Delete Period</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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