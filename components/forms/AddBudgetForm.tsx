// components/forms/AddBudgetForm.tsx
import { addBudget } from '@/lib/firebase-service';
import { Budget } from '@/types/data';
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

interface AddBudgetFormProps {
  userId: string;
  periodId: string;
  onBudgetAdded: (newBudget: Budget) => void;
  onClose: () => void;
}

export default function AddBudgetForm({
  userId,
  periodId,
  onBudgetAdded,
  onClose,
}: AddBudgetFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !amount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const newBudget = await addBudget({
        name: name.trim(),
        amount_allocated: parseFloat(amount),
        userId,
        periodId,
        status: 'not_paid',
      });
      onBudgetAdded(newBudget as Budget);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.modalTitle}>Add New Budget</Text>
      <TextInput
        style={styles.input}
        placeholder="Budget Name (e.g., Groceries)"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Amount Allocated"
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
            <Text style={styles.modalButtonText}>Add Budget</Text>
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