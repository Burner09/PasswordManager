import React, { useState, useContext } from 'react'
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function ChangePasswordModal({ onDismiss, visible }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useContext(AuthContext);
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
      <Formik
        initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          if (!values.oldPassword || !values.newPassword || !values.confirmPassword) {
            setMessage('All fields are required');
            setIsLoading(false);
            return;
          }

          if(values.newPassword !== values.confirmPassword) {
            setMessage('Password does not match');
            setIsLoading(false)
            return;
          }

          axios.put(`http://192.168.1.19:3001/changepassword/${userEmail}`, values)
            .then((res) => {
              console.log(res.data)
              onDismiss();
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
              <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20, textAlign: 'center' }}>
                Change Password
              </Text>
              
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" />}
                label="Current Password"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                value={props.values.oldPassword}
                onChangeText={props.handleChange('oldPassword')}
              />
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" />}
                label="New Password"
                secureTextEntry={!showPassword}
                value={props.values.newPassword}
                onChangeText={props.handleChange('newPassword')}
              />
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" />}
                label="Confirm New Password"
                secureTextEntry={!showPassword}
                value={props.values.confirmPassword}
                onChangeText={props.handleChange('confirmPassword')}
              />
              {message && <Text style={{color: 'red'}}>{message}</Text>}
              <View style={{ marginBottom: 25, flexDirection: 'row', gap: 20}}>
                <Button style={{flex: 1, borderRadius: 4}} mode="contained" onPress={()=>{onDismiss();setMessage('');}}>
                  <Text style={{fontSize: 15, fontWeight: 600}}>Cancel</Text>
                </Button>
                <Button style={{flex: 1, borderRadius: 4}} loading={isLoading} mode="contained" onPress={props.handleSubmit}>
                  <Text style={{fontSize: 15, fontWeight: 600}}>Change Password</Text>
                </Button>
              </View>             
            </View>
          )}
        </Formik>
      </Modal>
    </Portal>
  )
}
