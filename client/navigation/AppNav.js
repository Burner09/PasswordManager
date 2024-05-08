import React, {useContext} from 'react'

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "../navigation/AuthStack";
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import AppStack from './AppStack';

export default function AppNav() {
  const {isLoading, userToken} = useContext(AuthContext)

  if(isLoading) {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      { userToken !== null? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}
