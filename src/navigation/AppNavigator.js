// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '../screens/DashboardScreen';
import TambahTransaksiScreen from '../screens/TambahTransaksiScreen';
import TransaksiScreen from '../screens/TransaksiScreen';
import DetailTransaksiScreen from '../screens/DetailTransaksiScreen';
import RekapScreen from '../screens/RekapScreen';
import PengaturanScreen from '../screens/PengaturanScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="TambahTransaksi" component={TambahTransaksiScreen} />
        <Stack.Screen name="Transaksi" component={TransaksiScreen} />
        <Stack.Screen name="DetailTransaksi" component={DetailTransaksiScreen} />
        <Stack.Screen name="Rekap" component={RekapScreen} />
        <Stack.Screen name="Pengaturan" component={PengaturanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
