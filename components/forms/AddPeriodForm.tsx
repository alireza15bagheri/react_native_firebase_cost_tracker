// components/forms/AddPeriodForm.tsx
import { addPeriod } from '@/lib/firebase-service';
import { Period } from '@/types/data';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface AddPeriodFormProps {
  userId: string;
  onPeriodAdded: (newPeriod: Period) => void;
  onClose: () => void;
}

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default function AddPeriodForm({ userId, onPeriodAdded, onClose }: AddPeriodFormProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || (showDatePicker === 'start' ? startDate : endDate);
    setShowDatePicker(null); // Hide picker on all platforms
    if (currentDate) {
      if (showDatePicker === 'start') {
        setStartDate(currentDate);
      } else {
        setEndDate(currentDate);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Error', 'End date cannot be before the start date.');
      return;
    }

    setLoading(true);
    try {
      const newPeriod = await addPeriod({
        name: name.trim(),
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        userId,
      });
      onPeriodAdded(newPeriod as Period);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.modalTitle}>Add New Period</Text>
      <TextInput
        style={styles.input}
        placeholder="Period Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker('start')}>
        <Text style={styles.dateButtonText}>{startDate ? formatDate(startDate) : 'Select Start Date'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker('end')}>
        <Text style={styles.dateButtonText}>{endDate ? formatDate(endDate) : 'Select End Date'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <RNDateTimePicker
          value={
            (showDatePicker === 'start' ? startDate : endDate) || new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
            <Text style={styles.modalButtonText}>Add Period</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}>
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
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