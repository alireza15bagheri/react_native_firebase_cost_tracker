import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AppModal({ visible, onClose, children }: AppModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <BlurView intensity={50} tint="dark" style={styles.modalContainer}>
        <View style={styles.modalContent}>{children}</View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 22,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
});