import React, { useContext, useEffect, useState } from 'react'
import { Button, PaperProvider, Divider } from 'react-native-paper';
import { View, Text, SafeAreaView, ToastAndroid } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ChangePasswordModal from '../components/Modals/ChangePasswordModal';
import DeleteAccountModal from '../components/Modals/DeleteAccountModal';
import PrivacyAndSafety from '../components/Modals/PrivacyAndSafety';
import ChangeEmailModal from '../components/Modals/ChangeEmailModal';
import ChangeUserNameModal from '../components/Modals/ChangeUserNameModal';

export default function AccountScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { logout, userFullName, userEmail, isActive } = useContext(AuthContext);

  useEffect(() => {
    isActive()
  }, []);

  const getInitials = (fullName) => {
    if (!fullName) return '';

    const words = fullName.split(' ');
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    return initials.join('');
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const initials = getInitials(userFullName);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 10, backgroundColor: '#c8efe4' }}>
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
            <View style={{ padding: 5 }}>
              <ChangeUserNameModal showToast={showToast} visible={showNameModal} onDismiss={() => setShowNameModal(false)} />
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => setShowNameModal(true)}
              >
                Change User Name
              </Button>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 5 }}>
              <ChangeEmailModal showToast={showToast} visible={showEmailModal} onDismiss={() => setShowEmailModal(false)} />
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => setShowEmailModal(true)}
              >
                Change Email
              </Button>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 5 }}>
              <ChangePasswordModal showToast={showToast} visible={showPasswordModal} onDismiss={() => setShowPasswordModal(false)} />
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </View>
            <Divider bold={true} />
            <View style={{ padding: 5 }}>
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
            <View style={{ padding: 5 }}>
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
            <View style={{ padding: 5 }}>
              <Button 
                textColor='#022444'
                labelStyle={{fontSize: 14, fontWeight: 800}}
                onPress={() => logout()}
              >
                Log Out
              </Button>
            </View>
          </View>
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
}

