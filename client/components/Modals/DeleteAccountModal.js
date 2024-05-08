import React, { useState, useContext } from 'react'
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function DeleteAccountModal({ onDismiss, visible }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail, deleteAccount } = useContext(AuthContext);
  
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
      <Formik
        initialValues={{ password: '' }}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          if (!values.password) {
            setMessage('Please enter password');
            setIsLoading(false);
            return;
          }
          axios.post(`http://192.168.1.19:3001/deleteaccount/${userEmail}`, values)
            .then((res) => {
              console.log(res.data)
              onDismiss();
              deleteAccount()
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
                Please confirm delete
              </Text>
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" />}
                label="Enter Password"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                value={props.values.password}
                onChangeText={props.handleChange('password')}
              />
              {message && <Text style={{color: 'red'}}>{message}</Text>}
              <View style={{ marginBottom: 25, flexDirection: 'row', gap: 20}}>
                <Button style={{flex: 1, borderRadius: 4}} mode="contained" onPress={()=>{onDismiss();setMessage('');}}>
                  <Text style={{fontSize: 15, fontWeight: 600}}>Cancel</Text>
                </Button>
                <Button style={{flex: 1, borderRadius: 4}} loading={isLoading} mode="contained" onPress={props.handleSubmit}>
                  <Text style={{fontSize: 15, fontWeight: 600}}>Delete Account</Text>
                </Button>
              </View>             
            </View>
          )}
        </Formik>
      </Modal>
    </Portal>
  )
}
