// components/forms/AddMiscellaneousCostForm.tsx
import { addMiscellaneousCost } from '@/lib/firebase-service';
import { MiscellaneousCost } from '@/types/data';
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

interface AddMiscellaneousCostFormProps {
  userId: string;
  periodId: string;
  onCostAdded: (newCost: MiscellaneousCost) => void;
  onClose: () => void;
}

export default function AddMiscellaneousCostForm({
  userId,
  periodId,
  onCostAdded,
  onClose,
}: AddMiscellaneousCostFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !amount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    const costAmount = parseFloat(amount);
    if (isNaN(costAmount) || costAmount < 0) {
      Alert.alert('Error', 'Please enter a valid, non-negative amount.');
      return;
    }

    setLoading(true);
    try {
      const newCost = await addMiscellaneousCost({
        title: title.trim(),
        amount: costAmount,
        userId,
        periodId,
      });
      onCostAdded(newCost as MiscellaneousCost);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.modalTitle}>Add Miscellaneous Cost</Text>
      <TextInput
        style={styles.input}
        placeholder="Cost Title (e.g., Car Repair)"
        value={title}
        onChangeText={setTitle}
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
            <Text style={styles.modalButtonText}>Add Cost</Text>
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