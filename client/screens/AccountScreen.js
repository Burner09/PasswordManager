import React, { useContext, useEffect, useState } from 'react'
import { Button, PaperProvider, Divider } from 'react-native-paper';

import { View, Text, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ChangePasswordModal from '../components/Modals/ChangePasswordModal';
import DeleteAccountModal from '../components/Modals/DeleteAccountModal';
import PrivacyAndSafety from '../components/Modals/PrivacyAndSafety';

export default function AccountScreen({navigation}) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { logout, userFullName, userEmail, isActive } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      isActive()
    });

    return unsubscribe;
  }, []);

  const getInitials = (fullName) => {
    if (!fullName) return '';

    const words = fullName.split(' ');
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    return initials.join('');
  };

  const initials = getInitials(userFullName);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35, backgroundColor: '#c8efe4' }}>
      <PaperProvider>
        <View style={{ flex: 1, padding: 15 }}>
          <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', marginBottom: 20 }}>
            Account
          </Text>
          <View style={{ backgroundColor: '#fff', borderWidth: 2, borderRadius: 10, borderColor: '#022444', padding: 20, marginHorizontal: 5 }}>
            <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 40}}>
              <Text style={{textAlign: 'center', backgroundColor: '#022444', color: '#c8efe4', borderWidth: 5, borderRadius: 100, borderColor: '#c8efe4', fontSize: 45, fontWeight: 500, padding: 15}}>{initials}</Text>
              <Text style={{ fontSize: 18, fontWeight: 500}}>{userFullName}</Text>
              <Text style={{ fontSize: 18, fontWeight: 500}}>{userEmail}</Text>
            </View>
            <View style={{ padding: 10 }}>
              <ChangePasswordModal visible={showPasswordModal} onDismiss={() => setShowPasswordModal(false)} />
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 10 }}>
              <DeleteAccountModal visible={showDeleteModal} onDismiss={() => setShowDeleteModal(false)} />
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 10 }}>
              <PrivacyAndSafety visible={showPrivacyModal} onDismiss={() => setShowPrivacyModal(false)} />
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => setShowPrivacyModal(true)}
              >
                Privacy and Safety
              </Button>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 10 }}>
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => logout()}
              >
                Sign Out
              </Button>
            </View>
          </View>
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
}

