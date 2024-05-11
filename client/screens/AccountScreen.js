import React, { useContext, useState } from 'react'
import { Button, PaperProvider } from 'react-native-paper';

import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ChangePasswordModal from '../components/Modals/ChangePasswordModal';
import DeleteAccountModal from '../components/Modals/DeleteAccountModal';

export default function AccountScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {logout} = useContext(AuthContext)
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35 }}>
      <PaperProvider>
        <View>
          <Text>Person's name and shit</Text>
        </View>
        <View>
          <ChangePasswordModal visible={showPasswordModal} onDismiss={() => setShowPasswordModal(false)}/>
          <Button style={{marginTop: 30}} onPress={() => setShowPasswordModal(true)}>
            Change Password
          </Button>
        </View>
        <View>
          <DeleteAccountModal visible={showDeleteModal} onDismiss={() => setShowDeleteModal(false)}/>
          <Button style={{marginTop: 30}} onPress={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        </View>
        <View>
          <Button style={{marginTop: 30}} onPress={() => logout()}>
            Sign Out
          </Button>
        </View>
      </PaperProvider>
    </SafeAreaView>
  )
}
