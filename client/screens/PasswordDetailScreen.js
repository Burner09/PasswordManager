import React, { useState } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { IconButton, PaperProvider } from 'react-native-paper';
import DeletePasswordModal from '../components/Modals/DeletePasswordDetail';

export default function PasswordDetailScreen({navigation, route}) {
  const { account } = route.params;
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35 }}>
      <PaperProvider>
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <IconButton
              icon="arrow-left"
              size={35}
              onPress={() => navigation.navigate('All Passwords')}
            />
            <Text style={{fontSize: 26, fontWeight: 800}}>{account.name} Details</Text>
          </View>
          <View>
            <Text>{account.name}</Text>
            <Text>{account.type}</Text>
            <Text>{account.userName}</Text>
            <Text>{account.password}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <IconButton
                icon="pencil"
                size={35}
                onPress={() => navigation.navigate('All Passwords')}
              />
              <Text>Edit</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <DeletePasswordModal visible={showModal} onDismiss={() => setShowModal(false)} account={account} navigate={() => navigation.navigate('All Passwords')}/>
              <IconButton
                icon="delete"
                size={35}
                onPress={() => setShowModal(true)}
              />
              <Text>Trash</Text>
            </View>
          </View>
        </View>
      </PaperProvider>
    </SafeAreaView>
  )
}
