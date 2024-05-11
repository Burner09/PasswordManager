import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

export default function AllPasswordScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedType, setSelectedType] = useState('Online Service');
  const { userEmail } = useContext(AuthContext);

  const fetchData = () => {
    axios.get(`${process.env.EXPO_PUBLIC_API_SERVERURL}/passwords/${userEmail}`)
      .then((res) => {
        setAccounts(res.data);
        setFilteredAccounts(res.data.filter(account => account.type === 'Online Service'));
      }).catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
    setSelectedType('Online Service')

    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedType('Online Service')
      fetchData();
    });

    return unsubscribe;
  }, [navigation, userEmail]);

  const filterAccounts = (type) => {
    setSelectedType(type);
    if (type === 'Online Service') {
      setFilteredAccounts(accounts.filter(account => account.type === 'Online Service'));
    } else if (type === 'Device') {
      setFilteredAccounts(accounts.filter(account => account.type === 'Device'));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20 }}>
          All Accounts
        </Text>

        <View style={{ padding: 10, borderWidth: 2, borderRadius: 25}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
            <Button style={{ flex: 1 }} icon="web" mode={selectedType === 'Online Service' ? 'contained' : 'text'} onPress={() => filterAccounts('Online Service')}>
              Online Services
            </Button>
            <Button style={{ flex: 1 }} icon="devices" mode={selectedType === 'Device' ? 'contained' : 'text'} onPress={() => filterAccounts('Device')}>
              Devices
            </Button>
          </View>

          <View>
            {filteredAccounts.map((account, index) => (
              <TouchableOpacity key={index} onPress={() => navigation.navigate('Password Detail', { account })}>
                <View style={{ borderBottomWidth: 1, padding: 8, paddingLeft: 25 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700' }}>{account.name}</Text>
                  <Text style={{ fontSize: 14 }}>  {account.websiteOrDevice}</Text>
                  <Text style={{ fontSize: 14 }}>  {account.userName}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
