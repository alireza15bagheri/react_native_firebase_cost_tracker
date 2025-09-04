// components/forms/AddIncomeForm.tsx
import { addIncome } from '@/lib/firebase-service';
import { Income } from '@/types/data';
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

interface AddIncomeFormProps {
  userId: string;
  periodId: string;
  onIncomeAdded: (newIncome: Income) => void;
  onClose: () => void;
}

export default function AddIncomeForm({
  userId,
  periodId,
  onIncomeAdded,
  onClose,
}: AddIncomeFormProps) {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!source.trim() || !amount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const newIncome = await addIncome({
        source: source.trim(),
        amount: parseFloat(amount),
        userId,
        periodId,
      });
      onIncomeAdded(newIncome as Income);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.modalTitle}>Add New Income</Text>
      <TextInput
        style={styles.input}
        placeholder="Source (e.g., Salary)"
        value={source}
        onChangeText={setSource}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
            <Text style={styles.modalButtonText}>Add Income</Text>
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