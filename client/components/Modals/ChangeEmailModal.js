import React, { useState, useContext } from 'react'
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function ChangeEmailModal({ onDismiss, visible, showToast }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail, changeEmail } = useContext(AuthContext);
  
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20, marginHorizontal: 10, borderWidth: 2, borderRadius: 10, borderColor: '#022444'}}>
      <Formik
        enableReinitialize={true}
        initialValues={{ newEmail: userEmail, password: '' }}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          if (!values.newEmail || !values.password) {
            setMessage('All fields are required');
            showToast('All fields are required');
            setIsLoading(false);
            return;
          }

          if (values.newEmail === userEmail) {
            setMessage('New Email must be different');
            showToast('New Email must be different');
            setIsLoading(false);
            return;
          }

          axios.put(`${process.env.EXPO_PUBLIC_API_SERVERURL}/accounts/changeuseremail/${userEmail}`, values)
            .then((res) => {
              showToast(res.data.message);
              changeEmail(values.newEmail);
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
                Change Email
              </Text>
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="at" color="#022444" />}
                label="Email"
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
                value={props.values.newEmail}
                onChangeText={props.handleChange('newEmail')}
              />
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="lock" color="#022444" />}
                label="Enter Password"
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
                value={props.values.password}
                onChangeText={props.handleChange('password')}
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
                  Change
                </Button>
              </View>             
            </View>
          )}
        </Formik>
      </Modal>
    </Portal>
  )
}
