import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Button, Icon } from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;

export default function AllPasswordScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedType, setSelectedType] = useState('Online Service');
  const { userEmail, userFullName } = useContext(AuthContext);

  const fetchData = () => {
    axios.get(`${process.env.EXPO_PUBLIC_API_SERVERURL}/passwords/${userEmail}`)
      .then((res) => {
        setAccounts(res.data);
        filterAccounts(selectedType, res.data);
      }).catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
    setSelectedType('Online Service'); 

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
      setSelectedType('Online Service'); 
    });

    return unsubscribe;
  }, [navigation, userEmail]);

  const filterAccounts = (type, data) => {
    setSelectedType(type)
    setFilteredAccounts(data.filter(account => account.type === type));
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35, backgroundColor: '#c8efe4' }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 35, fontWeight: 800, color:'#022444', marginBottom: 20 }}>
          COBCRYPT
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 40, borderWidth: 1,  backgroundColor: '#f27d42', borderRadius: 10}}>
          <Text style={{fontSize: 25, fontWeight: 700, color: '#fff'}}>Hello Corn Lover {userFullName}</Text>
        </View>

        <View style={{  marginTop: 15 }}>
          <Text style={{fontSize: 20, color:'#022444', fontWeight: 700, marginBottom: 10}}>Your Cobs Sire</Text>
          <View style={{padding: 10}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
              <Button 
                style={{ flex: 1 }} 
                labelStyle={{ fontSize: 16 }}
                buttonColor={selectedType === 'Online Service' ? '#022444' : ''} 
                textColor={selectedType !== 'Online Service' ? '#022444' : ''} 
                icon="web" 
                mode={selectedType === 'Online Service' ? 'contained' : 'text'} 
                onPress={() => filterAccounts('Online Service', accounts)}
              >
                Online Services {selectedType === 'Online Service' && `(${filteredAccounts.length})`}
              </Button>
              <Button 
                style={{ flex: 1 }} 
                labelStyle={{ fontSize: 16 }}
                buttonColor={selectedType === 'Device' ? '#022444' : ''} 
                textColor={selectedType !== 'Device' ? '#022444' : ''} 
                icon="devices" 
                mode={selectedType === 'Device' ? 'contained' : 'text'} 
                onPress={() => filterAccounts('Device', accounts)}
              >
                Devices {selectedType === 'Device' && `(${filteredAccounts.length})`}
              </Button>
            </View>

            <ScrollView style={{flexGrow: 0, maxHeight: screenHeight * 0.55}}>
              {filteredAccounts.length > 0 ? filteredAccounts.map((account, index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate('Password Detail', { account })}>
                  <View style={{ backgroundColor: '#fff', borderWidth: 1, borderRadius: 10, marginBottom: 10, padding: 5, paddingLeft: 25 }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon source="corn" size={20}/>
                      <Text style={{ fontSize: 18, fontWeight: '700' }}> {account.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                      <Icon source={selectedType === 'Online Service' ? "link" : "cellphone-link"} size={18}/>
                      <Text style={{ fontSize: 16 }}> {account.websiteOrDevice}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                      <Icon source="account-box" size={18}/>
                      <Text style={{ fontSize: 16 }}> {account.userName}</Text>
                    </View>
                    
                  </View>
                </TouchableOpacity>
              )) : (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text>No {selectedType === 'Online Service' ? 'Online Services' : 'Devices'} </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
