import React, { useState, useContext } from 'react'
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function ChangePasswordModal({ onDismiss, visible, showToast }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useContext(AuthContext);
  
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20, marginHorizontal: 10, borderWidth: 2, borderRadius: 10, borderColor: '#022444'}}>
      <Formik
        initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          if (!values.oldPassword || !values.newPassword || !values.confirmPassword) {
            setMessage('All fields are required');
            showToast('All fields are required');
            setIsLoading(false);
            return;
          }

          if(values.newPassword !== values.confirmPassword) {
            setMessage('Password does not match');
            showToast('Password does not match');
            setIsLoading(false)
            return;
          }

          axios.put(`${process.env.EXPO_PUBLIC_API_SERVERURL}/accounts/changepassword/${userEmail}`, values)
            .then((res) => {
              showToast(res.data.message)
              setIsLoading(false);
              setMessage('');
              resetForm();
              onDismiss();
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
              <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', textAlign: 'center' }}>
                Change Password
              </Text>
              
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" color="#022444" />}
                label="Current Password"
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    color="#022444"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                value={props.values.oldPassword}
                onChangeText={props.handleChange('oldPassword')}
              />
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" color="#022444" />}
                label="New Password"
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
                secureTextEntry={!showPassword}
                value={props.values.newPassword}
                onChangeText={props.handleChange('newPassword')}
              />
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" color="#022444" />}
                label="Confirm New Password"
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
                secureTextEntry={!showPassword}
                value={props.values.confirmPassword}
                onChangeText={props.handleChange('confirmPassword')}
              />
              {message && <Text style={{color: 'red'}}>{message}</Text>}
              <View style={{ marginBottom: 25, flexDirection: 'row', gap: 20}}>
                <Button 
                  style={{flex: 1, borderRadius: 4}} 
                  labelStyle={{fontSize: 15, fontWeight: 600}}
                  buttonColor='#f27d42' 
                  mode="contained" 
                  onPress={()=>{onDismiss();setMessage('');}}
                >
                  Cancel
                </Button>
                <Button 
                  style={{flex: 1, borderRadius: 4}} 
                  labelStyle={{fontSize: 15, fontWeight: 600}}
                  buttonColor='#f27d42' 
                  loading={isLoading} 
                  mode="contained" 
                  onPress={props.handleSubmit}
                >
                  Confirm
                </Button>
              </View>             
            </View>
          )}
        </Formik>
      </Modal>
    </Portal>
  )
}
