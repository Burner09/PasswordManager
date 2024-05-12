import React, { useState, useContext, useEffect } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login, userEmail, userFullName } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#c8efe4' }}>
      <Formik
        enableReinitialize={true}
        initialValues={{ email: userEmail, password: '', fullName: userFullName }}
        onSubmit={(values) => {
          setIsLoading(true);
          if (!values.email || !values.password) {
            setMessage('All fields are required');
            setIsLoading(false);
            return;
          }
          axios.post(`${process.env.EXPO_PUBLIC_API_SERVERURL}/signin`, values)
            .then((res) => {
              login(res.data.token, values.email, res.data.fullName);
              setIsLoading(false);
            })
            .catch((err) => {
              setMessage(err.response.data.message);
              setIsLoading(false);
            });
        }}
      >
        {(props) => (
          <View style={{ gap: 15 }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/authimage.png')}
                style={{ height: 200, width: 200, borderRadius: 40, marginBottom: 10 }}
              />
            </View>
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', marginBottom: 20 }}>
              Login {props.values.fullName}
            </Text>
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="at" color="#022444" />}
              label="Email"
              outlineColor='#022444'
              activeOutlineColor="#022444"
              value={props.values.email}
              onChangeText={props.handleChange('email')}
            />
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="lock" color="#022444"/>}
              label="Password"
              outlineColor='#022444'
              activeOutlineColor="#022444"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  color="#022444"
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              value={props.values.password}
              onChangeText={props.handleChange('password')}
            />
            {message && <Text style={{ color: 'red' }}>{message}</Text>}
            <Button style={{ borderRadius: 4 }} buttonColor='#f27d42' loading={isLoading} mode="contained" onPress={props.handleSubmit}>
              <Text style={{ fontSize: 18, fontWeight: 600 }}>Login</Text>
            </Button>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30, }}>
              <Text style={{ fontSize: 16 }}>New to this app?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#022444', fontSize: 16, fontWeight: '700' }}> Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}