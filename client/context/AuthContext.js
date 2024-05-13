import React, {createContext, useState, useEffect} from 'react';
import { ToastAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFullName, setUserFullName] = useState(null);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const login = (token, email, fullName) => {
    setIsLoading(true);
    setUserToken(token);
    setUserEmail(email)
    setUserFullName(fullName)
    SecureStore.setItemAsync('userToken', token);
    SecureStore.setItemAsync('userEmail', email);
    SecureStore.setItemAsync('userFullName', fullName);
    showToast('Logged in Successful');
    setIsLoading(false);
  }

  const logout = () => {
    setIsLoading(true);
    SecureStore.deleteItemAsync('userToken')
    setUserToken(null);
    showToast('Logged out Successful');
    setIsLoading(false);
  }

  const changeUserFullName = (name) => {
    setUserFullName(name)
    SecureStore.setItemAsync('userFullName', name);
  }

  const changeEmail = ( email) => {
    setUserEmail(email)
    SecureStore.setItemAsync('userEmail', email);
  }

  deleteAccount = () => {
    setIsLoading(true);
    SecureStore.deleteItemAsync('userToken')
    SecureStore.deleteItemAsync('userEmail');
    SecureStore.deleteItemAsync('userFullName');
    setUserToken(null);
    setUserEmail(null);
    setUserFullName(null);
    showToast('Account Deleted');
    setIsLoading(false);
  }

  const isActive = async () => {
    axios.post(`${process.env.EXPO_PUBLIC_API_SERVERURL}/accounts/auth`, {token: userToken})
    .then((res) => {
      setUserToken(res.data.token)
    }).catch((err) => {
      console.log(err)
      showToast('You were away for too long');
      setUserToken(null);
    })
  }

  const isLoggedin = async () => {
    try {
      setIsLoading(true);
      setUserEmail(await SecureStore.getItemAsync('userEmail'))
      setUserFullName(await SecureStore.getItemAsync('userFullName'))
      let userToken = await SecureStore.getItemAsync('userToken');
      if(userToken !== null) {
        axios.post(`${process.env.EXPO_PUBLIC_API_SERVERURL}/accounts/auth`, {token: userToken})
        .then((res) => {
          setUserToken(res.data.token)
          setIsLoading(false);
        }).catch((err) => {
          console.log(err)
          setUserToken(null);
          setIsLoading(false);
        })
      } else {
        setIsLoading(false)
        setUserToken(null);
      }
    } catch(e) {
      setIsLoading(false);
      console.log("is logged in error",e)
    }
  }

  useEffect(() => {
    isLoggedin();
  }, [])

  return (
    <AuthContext.Provider value={{login, logout, deleteAccount, isLoading, userToken, userEmail, userFullName, isActive, changeEmail, changeUserFullName}}>
      {children}
    </AuthContext.Provider>
  );
}