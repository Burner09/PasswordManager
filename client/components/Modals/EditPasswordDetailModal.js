import React, { useState, useContext } from 'react'
import { TextInput, Button, RadioButton, Portal, Modal } from 'react-native-paper';
import { View, Text} from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function EditPasswordDetailModal({onDismiss, visible, account, navigate, showToast}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useContext(AuthContext);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 10, marginHorizontal: 10, borderWidth: 2, borderRadius: 10, borderColor: '#022444'}}>
        <Formik
          initialValues={{ type: account.type, name: account.name, websiteOrDevice: account.websiteOrDevice, userName: account.userName, password: account.password }}
          onSubmit={async (values, { resetForm }) => {
            setIsLoading(true);
            if (!values.type || !values.name || !values.websiteOrDevice || !values.userName || !values.password) {
              setMessage('All fields are required');
              showToast('All fields are required');
              setIsLoading(false);
              return;
            }

            if(values.type === account.type && values.name === account.name && values.websiteOrDevice === account.websiteOrDevice && values.userName === account.userName && values.password === account.password) {
              setMessage('No changes have been made');
              showToast('No changes have been made');
              setIsLoading(false);
              return;
            }

            axios.put(`${process.env.EXPO_PUBLIC_API_SERVERURL}/passwords/${userEmail}/${account._id}`, {updatedPasswordDetails: values})
              .then((res) => {
                showToast(res.data.message)
                navigate()
                setIsLoading(false);
                setMessage('');
                resetForm();
              }).catch((err) => {
                console.log(err)
                setMessage(err.response.data.message);
                showToast(err.response.data.message);
                setIsLoading(false);
              });
          }}
        >
          {(props) => (
            <View style={{gap: 20}}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444',textAlign: 'center' }}>
                Edit Details
              </Text>
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5}}>
                <TextInput
                  mode="outlined"
                  label="Name"
                  placeholder='This account'
                  outlineColor='#022444'
                  activeOutlineColor="#f27d42"
                  value={props.values.name}
                  onChangeText={props.handleChange('name')}
                  style={{ flex: 1 }}
                />
                <TextInput
                  mode="outlined"
                  label="Website/ Device"
                  placeholder='youtube.com'
                  outlineColor='#022444'
                  activeOutlineColor="#f27d42"
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
                activeOutlineColor="#f27d42"
                value={props.values.userName}
                onChangeText={props.handleChange('userName')}
              />
              <TextInput
                mode="outlined"
                label="Password"
                placeholder='Abc123(;-;)'
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
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
