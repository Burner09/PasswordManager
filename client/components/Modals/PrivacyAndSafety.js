import { Modal, Portal, Button } from 'react-native-paper';
import { ScrollView, Text, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function PrivacyAndSafety({ onDismiss, visible }) {
  
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20, marginHorizontal: 10, borderWidth: 2, borderRadius: 10, borderColor: '#022444', gap: 10}}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#022444', textAlign: 'center' }}>
          Privacy and Safety
        </Text>
        <ScrollView style={{flexGrow: 0, maxHeight: screenHeight * 0.5}}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#022444' }}>
            Data Security and Privacy
          </Text>
          <Text style={{ fontSize: 12, color: '#022444' }}>
            At COBCRYPT, we take the security and privacy of your data seriously. Your passwords and personal information are encrypted using advanced encryption algorithms, ensuring that only you have access to your accounts.
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#022444' }}>
            Inactivity Sign-out
          </Text>
          <Text style={{ fontSize: 12, color: '#022444' }}>
            For your added security, we automatically sign you out of the app after 5 minutes of inactivity. This means that if you step away from your device or forget to sign out manually, your account will be automatically logged out to prevent unauthorized access.
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#022444' }}>
            Thank You for Choosing CobCrypt
          </Text>
          <Text style={{ fontSize: 12, color: '#022444' }}>
            We want to thank you for choosing CobCrypt to manage your passwords and sensitive information. Your trust in us is valued, and we're committed to providing you with a secure and reliable experience.
          </Text>
        </ScrollView>
        <Button 
          textColor='#022444'
          labelStyle={{fontSize: 14, fontWeight: 800}}
          onPress={() => onDismiss()}
        >
          Ok
        </Button>
      </Modal>
    </Portal>
  )
}
