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
  const { login, userEmail } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Formik
        enableReinitialize={true}
        initialValues={{ email: userEmail, password: '', }}
        onSubmit={(values) => {
          setIsLoading(true);
          if (!values.email || !values.password) {
            setMessage('All fields are required');
            setIsLoading(false);
            return;
          }
          axios.post(`${process.env.EXPO_PUBLIC_API_SERVERURL}/signin`, values)
            .then((res) => {
              login(res.data.token, values.email);
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
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20 }}>
              Login
            </Text>
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="at" />}
              label="Email"
              value={props.values.email}
              onChangeText={props.handleChange('email')}
            />
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
              label="Password"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              value={props.values.password}
              onChangeText={props.handleChange('password')}
            />
            {message && <Text style={{ color: 'red' }}>{message}</Text>}
            <Button style={{ borderRadius: 4 }} loading={isLoading} mode="contained" onPress={props.handleSubmit}>
              <Text style={{ fontSize: 18, fontWeight: 600 }}>Login</Text>
            </Button>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30, }}>
              <Text style={{ fontSize: 16 }}>New to this app?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#AD40AF', fontSize: 16, fontWeight: '700' }}> Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}