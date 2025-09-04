// components/forms/SetDailyLimitForm.tsx
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

interface SetDailyLimitFormProps {
  periodId: string;
  currentLimit: number;
  onLimitSet: (periodId: string, limit: number) => Promise<void>;
  onClose: () => void;
}

export default function SetDailyLimitForm({
  periodId,
  currentLimit,
  onLimitSet,
  onClose,
}: SetDailyLimitFormProps) {
  const [amount, setAmount] = useState(currentLimit > 0 ? currentLimit.toString() : '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const limitAmount = parseFloat(amount);
    if (isNaN(limitAmount) || limitAmount < 0) {
      Alert.alert('Error', 'Please enter a valid, non-negative amount.');
      return;
    }

    setLoading(true);
    await onLimitSet(periodId, limitAmount);
    setLoading(false);
    onClose();
  };

  return (
    <>
      <Text style={styles.modalTitle}>Set Daily Limit</Text>
      <TextInput
        style={styles.input}
        placeholder="Default Daily Limit Amount"
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
            <Text style={styles.modalButtonText}>Save Limit</Text>
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