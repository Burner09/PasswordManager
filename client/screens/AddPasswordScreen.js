import React, { useState, useContext } from 'react'
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { TextInput, Button, RadioButton, PaperProvider } from 'react-native-paper';
import { View, Text, SafeAreaView } from 'react-native';
import GeneratePasswordModal from '../components/Modals/GeneratePasswordModal';

export default function AddPasswordScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const { userEmail } = useContext(AuthContext);
  
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35 }}>
      <PaperProvider>
        <View style={{ flex: 1, padding: 15 }}>
          <Formik
            initialValues={{ type: '', name: '', websiteOrDevice: '', userName: '', password: '' }}
            onSubmit={async (values, { resetForm }) => {
              setIsLoading(true);
              if (!values.type || !values.name || !values.websiteOrDevice || !values.userName || !values.password) {
                setMessage('All fields are required');
                setIsLoading(false);
                return;
              }
              axios.put(`${process.env.EXPO_PUBLIC_API_SERVERURL}/passwords/${userEmail}`, {passwordDetails: values})
                .then((res) => {
                  console.log(res.data)
                  navigation.navigate('Home')
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
                <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20, }}>
                  Save New Account
                </Text>
                
                <RadioButton.Group onValueChange={props.handleChange('type')} value={props.values.type}>
                  <Text style={{ fontSize: 18, fontWeight: 600 }}>Type:</Text>
                  <View style={{ flexDirection: 'row', gap: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="Device" />
                      <Text style={{ fontSize: 16 }}>Device</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="Online Service" />
                      <Text style={{ fontSize: 16 }}>Online Service</Text>
                    </View>
                  </View>
                </RadioButton.Group>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20}}>
                  <TextInput
                    mode="outlined"
                    label="Name"
                    placeholder='This account'
                    value={props.values.name}
                    onChangeText={props.handleChange('name')}
                    style={{ flex: 1 }}
                  />
                  <TextInput
                    mode="outlined"
                    label="Website/ Device"
                    placeholder='youtube.com'
                    value={props.values.websiteOrDevice}
                    onChangeText={props.handleChange('websiteOrDevice')}
                    style={{ flex: 1 }}
                  />
                </View>
                <TextInput
                  mode="outlined"
                  label="Username/ Email"
                  placeholder='Byrd_202'
                  value={props.values.userName}
                  onChangeText={props.handleChange('userName')}
                />
                <TextInput
                  mode="outlined"
                  label="Password"
                  placeholder='Abc123(;-;)'
                  value={props.values.password}
                  onChangeText={props.handleChange('password')}
                />
                {message && <Text style={{color: 'red'}}>{message}</Text>}
                <Button style={{borderRadius: 4}} loading={isLoading} mode="contained" onPress={props.handleSubmit}>
                  <Text style={{fontSize: 18, fontWeight: 600}}>Save Account</Text>
                </Button>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                  }}>
                </View>
                <View>
                  <GeneratePasswordModal visible={showModal} usePassword={password => {
                    props.setFieldValue('password', password);
                    setShowModal(false);
                  }} onDismiss={() => setShowModal(false)}/>
                  <Button style={{marginTop: 30}} onPress={() => setShowModal(true)}>
                    Generate Password
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </PaperProvider>
    </SafeAreaView>
  )
}
