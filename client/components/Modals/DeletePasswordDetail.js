import React, {  useContext } from 'react'
import { Modal, Portal, Button } from 'react-native-paper';
import { View, Text } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function DeletePasswordModal({ onDismiss, visible, account, navigate }) {
  const { userEmail } = useContext(AuthContext);

  const handleDelete = () => {
    axios.delete(`${process.env.EXPO_PUBLIC_API_SERVERURL}/passwords/${userEmail}/${account._id}`)
    .then((res) => {
      console.log(res.data);
      onDismiss();
      navigate();
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20, textAlign: 'center' }}>
          Delete {account.name}?
        </Text>
        <View style={{ marginBottom: 25, flexDirection: 'row', gap: 20}}>
          <Button style={{flex: 1, borderRadius: 4}} mode="contained" onPress={()=>{onDismiss()}}>
            <Text style={{fontSize: 15, fontWeight: 600}}>Cancel</Text>
          </Button>
          <Button style={{flex: 1, borderRadius: 4}} mode="contained" onPress={handleDelete}>
            <Text style={{fontSize: 15, fontWeight: 600}}>Delete</Text>
          </Button>
        </View> 
      </Modal>
    </Portal>
  )
}
