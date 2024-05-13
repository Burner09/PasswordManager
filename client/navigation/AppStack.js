import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';

import AccountScreen from '../screens/AccountScreen';
import AddPasswordScreen from '../screens/AddPasswordScreen';
import PasswordStack from './PasswordStack';

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: '#c8efe4',
        tabBarActiveTintColor: '#f27d42',
        tabBarStyle: { backgroundColor: '#022444', height: 55 },
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true
      }}
    >
      <Tab.Screen 
        name='Passwords'
        component={PasswordStack}
        options={{
          tabBarIcon: ({ color }) => (<Icon source="shield-lock" color={color} size={38} />),
        }}
      />

      <Tab.Screen 
        name='Add'
        component={AddPasswordScreen}
        options={{
          tabBarIcon: ({ color }) => (<Icon source="plus-thick" color={color} size={40} />),
        }}
      />

      <Tab.Screen 
        name='Account'
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color }) => (<Icon source="account" color={color} size={40} />),
        }}
      />
    </Tab.Navigator>
  )
}
