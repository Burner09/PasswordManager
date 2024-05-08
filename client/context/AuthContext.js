import React, {createContext, useState, useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const login = (token, email) => {
    setIsLoading(true);
    setUserToken(token);
    setUserEmail(email)
    SecureStore.setItemAsync('userToken', token);
    SecureStore.setItemAsync('userEmail', email);
    setIsLoading(false);
  }

  logout = () => {
    setIsLoading(true);
    SecureStore.deleteItemAsync('userToken')
    setUserToken(null);
    setIsLoading(false);
  }

  deleteAccount = () => {
    setIsLoading(true);
    SecureStore.deleteItemAsync('userToken')
    SecureStore.deleteItemAsync('userEmail');
    setUserToken(null);
    setUserEmail(null);
    setIsLoading(false);
  }

  const isLoggedin = async () => {
    try {
      setIsLoading(true);
      setUserEmail(await SecureStore.getItemAsync('userEmail'))
      let userToken = await SecureStore.getItemAsync('userToken');
      if(userToken !== null) {
        axios.post('http://192.168.1.19:3001/auth', {token: userToken})
        .then((res) => {
          console.log(res.data);
          setUserToken(userToken);
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
    <AuthContext.Provider value={{login, logout, deleteAccount, isLoading, userToken, userEmail}}>
      {children}
    </AuthContext.Provider>
  );
}