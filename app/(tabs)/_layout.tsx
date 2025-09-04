// app/(tabs)/_layout.tsx
import CustomDrawerContent from '@/components/navigation/CustomDrawerContent';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { Drawer } from 'expo-router/drawer';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';

// This is required for the drawer navigator to work
import 'react-native-gesture-handler';

export default function AppLayout() {
  const { user } = useAuth(); // We'll need this to pass to the dashboard

  // We move the logout logic here, so it can be passed to the drawer
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          // We will pass a function to open the modal from the dashboard
          // The dashboard will handle the modal state
          onNewPeriod={() => {
            // This is a bit of a trick to pass an event up.
            // We can listen for this in the Dashboard screen.
            props.navigation.navigate('index', { openNewPeriodModal: true });
          }}
          onLogout={handleLogout}
        />
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#1e1e1e',
          width: 240,
        },
        drawerActiveTintColor: '#bb86fc',
        drawerInactiveTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#1e1e1e',
        },
        headerTintColor: '#fff',
      }}>
      <Drawer.Screen
        name="index" // This is the Dashboard screen
        options={{
          title: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="settings" // This is the Settings screen
        options={{
          title: 'Settings',
        }}
      />
    </Drawer>
  );
}