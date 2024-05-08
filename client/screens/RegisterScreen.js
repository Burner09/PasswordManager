import React, { useState, useContext } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';

export default function RegisterScreen({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <Formik
        initialValues={{ email: '', password: '', confirmpassword: '' }}
        onSubmit={(values) => {
          setIsLoading(true);
          if(!values.email || !values.password || !values.confirmpassword) {
            setMessage('All fields are required');
            setIsLoading(false)
            return;
          }

          if(values.password !== values.confirmpassword) {
            setMessage('Password does not match');
            setIsLoading(false)
            return;
          }

          axios.post('http://192.168.1.19:3001/signup', values)
          .then((res) => {
            setIsLoading(false);
            navigation.navigate('Login')
          }).catch((err) => {
            setMessage(err.response.data.message);
            setIsLoading(false);
          })
        }}
      >
        {(props) => (
          <View style={{gap: 15}}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/authimage.png')}
                style={{height: 200, width: 200, borderRadius: 40, marginBottom: 10}}
              />
            </View>
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20, }}>
              Register
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
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              value={props.values.password}
              onChangeText={props.handleChange('password')}
            />
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
              label="Confirm Password"
              secureTextEntry={!showPassword}
              value={props.values.confirmpassword}
              onChangeText={props.handleChange('confirmpassword')}
            />
            {message && <Text style={{color: 'red'}}>{message}</Text>}
            <Button style={{borderRadius: 4}} loading={isLoading} mode="contained" onPress={props.handleSubmit}>
              <Text style={{fontSize: 18, fontWeight: 600}}>Register</Text>
            </Button>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 30,
              }}>
              <Text style={{fontSize: 16}}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: '#AD40AF', fontSize: 16, fontWeight: '700'}}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
