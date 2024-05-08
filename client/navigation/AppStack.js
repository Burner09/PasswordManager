import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';

import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import AddPasswordScreen from '../screens/AddPasswordScreen';
import AllPasswordScreen from '../screens/AllPasswordScreen';

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: '#000',
        tabBarActiveTintColor: 'purple',
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen 
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (<Icon source="home" color={color} size={35} />),
        }}
      />

      <Tab.Screen 
        name='Add'
        component={AddPasswordScreen}
        options={{
          tabBarIcon: ({ color }) => (<Icon source="plus-thick" color={color} size={35} />),
        }}
      />

      <Tab.Screen 
        name='Passwords'
        component={AllPasswordScreen}
        options={{
          tabBarIcon: ({ color }) => (<Icon source="shield-lock" color={color} size={32} />),
        }}
      />

      <Tab.Screen 
        name='Account'
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color }) => (<Icon source="account" color={color} size={35} />),
        }}
      />
    </Tab.Navigator>
  )
}
