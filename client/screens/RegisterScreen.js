import React, { useState, useContext } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';

export default function RegisterScreen({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#c8efe4' }}>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmpassword: '' }}
        onSubmit={(values) => {
          setIsLoading(true);
          if(!values.firstName || !values.lastName || !values.email || !values.password || !values.confirmpassword) {
            setMessage('All fields are required');
            setIsLoading(false)
            return;
          }

          if(values.password !== values.confirmpassword) {
            setMessage('Password does not match');
            setIsLoading(false)
            return;
          }

          axios.post(`${process.env.EXPO_PUBLIC_API_SERVERURL}/accounts/signup`, values)
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
            <Text style={{ fontSize: 35, fontWeight: 800, color:'#022444', textAlign: 'center' }}>
              COBCRYPT
            </Text>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/authimage.png')}
                style={{height: 150, width: 150, borderRadius: 40, marginBottom: 10}}
              />
            </View>
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', marginBottom: 20, }}>
              Register
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
              <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="account-cowboy-hat" color="#022444" />}
                label="First Name"
                placeholder='Last Name'
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
                value={props.values.firstName}
                onChangeText={props.handleChange('firstName')}
                style={{ flex: 1 }}
              />
              <TextInput
                mode="outlined"
                label="Last Name"
                placeholder='Corn'
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
                value={props.values.lastName}
                onChangeText={props.handleChange('lastName')}
                style={{ flex: 1 }}
              />
            </View>
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="at"  color="#022444" />}
              label="Email"
              outlineColor='#022444'
              activeOutlineColor="#f27d42"
              value={props.values.email}
              onChangeText={props.handleChange('email')}
            />
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="lock" color="#022444" />}
              label="Password"
              secureTextEntry={!showPassword}
              outlineColor='#022444'
              activeOutlineColor="#f27d42"
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
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="lock" color="#022444" />}
              label="Confirm Password"
              outlineColor='#022444'
              activeOutlineColor="#f27d42"
              secureTextEntry={!showPassword}
              value={props.values.confirmpassword}
              onChangeText={props.handleChange('confirmpassword')}
            />
            {message && <Text style={{color: 'red'}}>{message}</Text>}
            <Button 
              style={{borderRadius: 4}} 
              labelStyle={{fontSize: 18, fontWeight: 600}}
              buttonColor='#f27d42' 
              loading={isLoading} 
              mode="contained" 
              onPress={props.handleSubmit}
            >
              Register
            </Button>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 30,
              }}>
              <Text style={{fontSize: 16}}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: '#022444', fontSize: 16, fontWeight: '700'}}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}
