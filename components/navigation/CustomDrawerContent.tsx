// components/navigation/CustomDrawerContent.tsx
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomDrawerContentProps {
  onNewPeriod: () => void;
  onLogout: () => void;
  [key: string]: any; // Accept other props from the navigator
}

export default function CustomDrawerContent(props: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#1e1e1e', flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Menu</Text>
        </View>

        {/* This will render the default drawer items if we ever add more screens to the drawer */}
        <DrawerItemList {...props} />

        <TouchableOpacity style={styles.drawerItem} onPress={props.onNewPeriod}>
          <Text style={styles.drawerItemText}>+ New Period</Text>
        </TouchableOpacity>

        {/* Spacer to push logout to the bottom */}
        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[styles.drawerItem, styles.logoutButton, { marginBottom: insets.bottom + 10 }]}
          onPress={props.onLogout}>
          <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    color: '#fff',
    marginVertical: 5,
    fontSize: 18,
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  logoutText: {
    color: '#ff453a',
  },
});