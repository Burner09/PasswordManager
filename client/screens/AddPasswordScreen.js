import React, { useState, useEffect, useContext } from 'react'
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
  const { userEmail, isActive } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      isActive()
    });

    return unsubscribe;
  }, []);
  
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35, backgroundColor: '#c8efe4' }}>
      <PaperProvider>
        <View style={{ flex: 1, padding: 15 }}>
          <Formik
            initialValues={{ type: 'Online Service', name: '', websiteOrDevice: '', userName: '', password: '' }}
            onSubmit={async (values, { resetForm }) => {
              setIsLoading(true);
              if (!values.type || !values.name || !values.websiteOrDevice || !values.userName || !values.password) {
                setMessage('All fields are required');
                setIsLoading(false);
                return;
              }
              axios.post(`${process.env.EXPO_PUBLIC_API_SERVERURL}/passwords/${userEmail}`, {passwordDetails: values})
                .then((res) => {
                  console.log(res.data)
                  navigation.navigate('Passwords')
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
                <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', marginBottom: 20, }}>
                  Save New Account
                </Text>
                
                <View style={{backgroundColor: '#fff', padding: 10, borderWidth: 2, borderRadius: 10, borderColor: '#022444', gap: 15}}>
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
                  <Button 
                    style={{borderRadius: 4}} 
                    labelStyle={{fontSize: 18, fontWeight: 600}}
                    loading={isLoading} 
                    buttonColor='#f27d42' 
                    mode="contained" 
                    onPress={props.handleSubmit}
                  >
                    Save Account
                  </Button>
                </View>
                <View>
                  <GeneratePasswordModal visible={showModal} usePassword={password => {
                    props.setFieldValue('password', password);
                    setShowModal(false);
                  }} onDismiss={() => setShowModal(false)}/>
                  <Button 
                    style={{marginTop: 10}} 
                    textColor='#022444' 
                    labelStyle={{fontSize: 18, fontWeight: 800}}
                    onPress={() => setShowModal(true)}
                  >
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
