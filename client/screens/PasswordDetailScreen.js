import React, { useState } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { IconButton, PaperProvider, Divider } from 'react-native-paper';
import DeletePasswordDetailModal from '../components/Modals/DeletePasswordDetailModal';
import EditPasswordDetailModal from '../components/Modals/EditPasswordDetailModal';

export default function PasswordDetailScreen({navigation, route}) {
  const { account } = route.params;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35, backgroundColor: '#c8efe4' }}>
      <PaperProvider>
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 30}}>
            <IconButton
              icon="arrow-left"
              size={35}
              onPress={() => navigation.navigate('All Passwords')}
            />
            <Text style={{fontSize: 26, fontWeight: 800, color:'#022444'}}>Password Details</Text>
          </View>
          <View style={{backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 30}}>
            <View style={{ padding: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 600, color:'#022444' }}>Name</Text>
              <Text style={{ fontSize: 18, color:'#022444' }}>{account.name}</Text>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 600, color:'#022444' }}>{account.type === 'Online Service'? 'Website': 'App'}</Text>
              <Text style={{ fontSize: 18, color:'#022444' }}>{account.websiteOrDevice}</Text>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 600, color:'#022444' }}>User Name</Text>
              <Text style={{ fontSize: 18, color:'#022444' }}>{account.userName}</Text>
            </View>
            <Divider bold={true} />
            <View style={{ flexDirection: 'row', padding: 15, justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 600, color:'#022444' }}>Password</Text>
                <Text style={{ fontSize: 18, color:'#022444' }}>{showPassword? account.password: '••••••••••••••••'}</Text>
              </View>
              <IconButton icon={showPassword ? 'eye-off' : 'eye'} iconColor="#022444" onPress={() => setShowPassword(!showPassword)} />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <EditPasswordDetailModal visible={showEditModal} onDismiss={() => setShowEditModal(false)} account={account} navigate={() => navigation.navigate('All Passwords')}/>
              <IconButton
                icon="pencil"
                iconColor='#022444'
                size={35}
                onPress={() => setShowEditModal(true)}
              />
              <Text style={{color: '#022444'}}>Edit</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <DeletePasswordDetailModal visible={showDeleteModal} onDismiss={() => setShowDeleteModal(false)} account={account} navigate={() => navigation.navigate('All Passwords')}/>
              <IconButton
                icon="delete"
                iconColor='#022444'
                size={35}
                onPress={() => setShowDeleteModal(true)}
              />
              <Text style={{color: '#022444'}}>Delete</Text>
            </View>
          </View>
        </View>
      </PaperProvider>
    </SafeAreaView>
  )
}
