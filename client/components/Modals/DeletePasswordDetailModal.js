import React, {  useContext } from 'react'
import { Modal, Portal, Button } from 'react-native-paper';
import { View, Text } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function DeletePasswordDetailModal({ onDismiss, visible, account, navigate }) {
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
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20, marginHorizontal: 10, borderWidth: 2, borderRadius: 10, borderColor: '#022444'}}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', marginBottom: 20, textAlign: 'center' }}>
          Delete {account.name}?
        </Text>
        <View style={{ marginBottom: 25, flexDirection: 'row', gap: 20}}>
          <Button 
            style={{flex: 1, borderRadius: 4}} 
            buttonColor='#f27d42' 
            mode="contained" 
            labelStyle={{fontSize: 15, fontWeight: 600}}
            onPress={()=>{onDismiss()}}
          >
            Cancel
          </Button>
          <Button 
            style={{flex: 1, borderRadius: 4}} 
            labelStyle={{fontSize: 15, fontWeight: 600}}
            buttonColor='#f27d42' 
            mode="contained" 
            onPress={handleDelete}
          >
            Delete
          </Button>
        </View> 
      </Modal>
    </Portal>
  )
}
