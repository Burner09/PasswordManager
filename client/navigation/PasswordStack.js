import React from 'react';
import { ToastAndroid } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllPasswordScreen from '../screens/AllPasswordScreen';
import PasswordDetailScreen from '../screens/PasswordDetailScreen';

const Stack = createNativeStackNavigator();

export default function PasswordStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='All Passwords' component={AllPasswordScreen} />
      <Stack.Screen name='Password Detail' component={PasswordDetailScreen} />
    </Stack.Navigator>
  )
}
