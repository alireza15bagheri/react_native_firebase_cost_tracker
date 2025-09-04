// components/forms/AddDailyCostForm.tsx
import { addDailyCost } from '@/lib/firebase-service';
import { DailyCost, Period } from '@/types/data';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface AddDailyCostFormProps {
  userId: string;
  period: Period;
  onCostAdded: (newCost: DailyCost) => void;
  onClose: () => void;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AddDailyCostForm({
  userId,
  period,
  onCostAdded,
  onClose,
}: AddDailyCostFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [spent, setSpent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false); // Hide the picker immediately

    // Only proceed if the user confirmed a date and a date object exists
    if (event.type === 'set' && selectedDate) {
      // Create a new Date object to ensure it's a stable JS instance
      const newDate = new Date(selectedDate);
      setDate(newDate);
    }
  };

  const handleSubmit = async () => {
    const spentAmount = parseFloat(spent);
    if (isNaN(spentAmount) || spentAmount < 0) {
      Alert.alert('Error', 'Please enter a valid, non-negative amount.');
      return;
    }

    // Date validation rule
    const formattedSelectedDate = formatDate(date);
    if (formattedSelectedDate < period.start_date || formattedSelectedDate > period.end_date) {
      Alert.alert(
        'Invalid Date',
        `The selected date must be between ${period.start_date} and ${period.end_date}.`
      );
      return;
    }

    setLoading(true);
    try {
      const newCost = await addDailyCost({
        date: formatDate(date),
        spent: spentAmount,
        userId,
        periodId: period.id,
      });
      onCostAdded(newCost as DailyCost);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Text style={styles.modalTitle}>Add Daily Cost</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText} numberOfLines={1} adjustsFontSizeToFit>
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <RNDateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
      )}

      <TextInput
        style={styles.input}
        placeholder="Amount Spent"
        value={spent}
        onChangeText={setSpent}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
            <Text style={styles.modalButtonText}>Add Cost</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2b2b2b',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
    width: '100%',
  },
  dateButton: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});