import React, { useState, useContext } from 'react'
import { TextInput, Button, RadioButton, Portal, Modal } from 'react-native-paper';
import { View, Text} from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function EditPasswordDetailModal({onDismiss, visible, account, navigate}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useContext(AuthContext);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20, marginHorizontal: 10, borderRadius: 10}}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', marginBottom: 20, textAlign: 'center' }}>
           Edit Details
        </Text>
        <Formik
          initialValues={{ type: account.type, name: account.name, websiteOrDevice: account.websiteOrDevice, userName: account.userName, password: account.password }}
          onSubmit={async (values, { resetForm }) => {
            setIsLoading(true);
            if (!values.type || !values.name || !values.websiteOrDevice || !values.userName || !values.password) {
              setMessage('All fields are required');
              setIsLoading(false);
              return;
            }
            axios.put(`${process.env.EXPO_PUBLIC_API_SERVERURL}/passwords/${userEmail}/${account._id}`, {updatedPasswordDetails: values})
              .then((res) => {
                console.log(res.data)
                navigate()
                setIsLoading(false);
                setMessage('');
                resetForm();
              }).catch((err) => {
                console.log(err)
                setMessage(err.response.data.message);
                setIsLoading(false);
              });
          }}
        >
          {(props) => (
            <View style={{gap: 20}}>
              <RadioButton.Group onValueChange={props.handleChange('type')} value={props.values.type}>
                <Text style={{ fontSize: 18, fontWeight: 600, color: '#022444' }}>Type:</Text>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Online Service" color='#f27d42' />
                    <Text style={{ fontSize: 16, color: '#022444' }}>Online Service</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Device" color='#f27d42' />
                    <Text style={{ fontSize: 16, color: '#022444' }}>Device</Text>
                  </View>
                </View>
              </RadioButton.Group>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20}}>
                <TextInput
                  mode="outlined"
                  label="Name"
                  placeholder='This account'
                  outlineColor='#022444'
                  activeOutlineColor="#022444"
                  value={props.values.name}
                  onChangeText={props.handleChange('name')}
                  style={{ flex: 1 }}
                />
                <TextInput
                  mode="outlined"
                  label="Website/ Device"
                  placeholder='youtube.com'
                  outlineColor='#022444'
                  activeOutlineColor="#022444"
                  value={props.values.websiteOrDevice}
                  onChangeText={props.handleChange('websiteOrDevice')}
                  style={{ flex: 1 }}
                />
              </View>
              <TextInput
                mode="outlined"
                label="Username/ Email"
                placeholder='Byrd_202'
                outlineColor='#022444'
                activeOutlineColor="#022444"
                value={props.values.userName}
                onChangeText={props.handleChange('userName')}
              />
              <TextInput
                mode="outlined"
                label="Password"
                placeholder='Abc123(;-;)'
                outlineColor='#022444'
                activeOutlineColor="#022444"
                value={props.values.password}
                onChangeText={props.handleChange('password')}
              />
              {message && <Text style={{color: 'red'}}>{message}</Text>}
              <View style={{ marginBottom: 20, flexDirection: 'row', gap: 20}}>
                <Button 
                  style={{flex: 1, borderRadius: 4}} 
                  buttonColor='#f27d42' 
                  mode="contained" 
                  labelStyle={{fontSize: 15, fontWeight: 600}}
                  onPress={()=>{onDismiss();setMessage('');}}
                >
                  Cancel
                </Button>
                <Button 
                  style={{flex: 1, borderRadius: 4}} 
                  loading={isLoading} 
                  buttonColor='#f27d42' 
                  mode="contained" 
                  labelStyle={{fontSize: 15, fontWeight: 600}}
                  onPress={props.handleSubmit}
                >
                  Edit
                </Button>
              </View>  
            </View>
          )}
        </Formik>
      </Modal>
    </Portal>
  )
}
