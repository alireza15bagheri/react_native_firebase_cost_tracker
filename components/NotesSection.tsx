// components/NotesSection.tsx
import { styles } from '@/styles/components/NotesSectionStyles';
import { Period } from '@/types/data';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface NotesSectionProps {
  period: Period | undefined;
  onSave: (periodId: string, notes: string) => Promise<void>;
}

export default function NotesSection({ period, onSave }: NotesSectionProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update local state when the period changes
    if (period) {
      setNotes(period.notes || '');
    }
  }, [period]);

  const handleSave = async () => {
    if (!period) return;
    setLoading(true);
    await onSave(period.id, notes);
    setLoading(false);
  };

  if (!period) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add any notes for this period..."
        placeholderTextColor="#888"
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Notes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}