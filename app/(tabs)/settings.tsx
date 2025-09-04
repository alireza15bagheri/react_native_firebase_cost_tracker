// app/(tabs)/settings.tsx
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { styles } from '@/styles/screens/SettingsStyles';
import { BlurView } from 'expo-blur';
import { signOut, updatePassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const { user } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The auth state listener in the root layout will handle the redirect.
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match.");
      return;
    }
    if (!user) {
      Alert.alert('Error', 'No user is signed in.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Your password has been updated successfully.');
      setModalVisible(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      // This error often means the user needs to sign in again to perform this sensitive action.
      Alert.alert(
        'Error',
        'This operation is sensitive and requires recent authentication. Please log out and log back in to change your password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.safeArea}>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>Settings</Text>

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <BlurView intensity={50} tint="dark" style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={[styles.input, focusedInput === 'new' && styles.inputFocused]}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#888"
              onFocus={() => setFocusedInput('new')}
              onBlur={() => setFocusedInput(null)}
            />
            <TextInput
              style={[styles.input, focusedInput === 'confirm' && styles.inputFocused]}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#888"
              onFocus={() => setFocusedInput('confirm')}
              onBlur={() => setFocusedInput(null)}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handlePasswordChange}>
                  <Text style={styles.modalButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BlurView>
      </Modal>
    </ThemedView>
  );
}