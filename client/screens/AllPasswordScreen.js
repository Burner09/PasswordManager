import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { View, Text, SafeAreaView } from 'react-native';

export default function AllPasswordScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const { userEmail } = useContext(AuthContext);

  const fetchData = () => {
    axios.get(`http://192.168.1.19:3001/passwords/${userEmail}`)
      .then((res) => {
        setAccounts(res.data);
      }).catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation, userEmail]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35 }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20, }}>
          All Accounts
        </Text>
        {accounts && accounts.map((account, index) => (
          <View key={index}>
            <View style={{ marginBottom: 10 }}>
              <Text>Type: {account.type}</Text>
              <Text>Name: {account.name}</Text>
              <Text>Website/Device: {account.websiteOrDevice}</Text>
              <Text>Password: {account.password}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}
