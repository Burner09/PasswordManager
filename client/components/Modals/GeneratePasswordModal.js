import React, { useState } from 'react'
import { Modal, Portal, Button, TextInput, Switch } from 'react-native-paper';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';

export default function GeneratePasswordModal({ onDismiss,visible, usePassword }) {
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isUseWord, setIsUseWord] = useState(false);

  const handleUsePassword = () => {
    if (generatedPassword) {
      usePassword(generatedPassword);
      setGeneratedPassword('')
    }
  };
  const dismiss =() => {
    setGeneratedPassword('')
    setIsUseWord(false)
    onDismiss(); 
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={dismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20, marginHorizontal: 10, borderWidth: 2, borderRadius: 10, borderColor: '#022444'}}>
      <Formik
        initialValues={{ word: '' }}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          axios.post(`${process.env.EXPO_PUBLIC_API_SERVERURL}/generate`, values)
            .then((res) => {
              setGeneratedPassword(res.data)
              setIsLoading(false);
              resetForm();
            }).catch((err) => {
              console.log(err)
              setIsLoading(false);
            });
        }}
      >
          {(props) => (
            <View style={{gap: 20}}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: '#022444', marginBottom: 20, textAlign: 'center' }}>
                Generate Password
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 18, color: '#022444'}}>Customize with Word</Text>
                <Switch value={isUseWord} color='#f27d42' onValueChange={() => {setIsUseWord(!isUseWord)}} />
              </View>
              {isUseWord && <TextInput
                mode="outlined"
                label="Enter Word or Phrase"
                outlineColor='#022444'
                activeOutlineColor="#f27d42"
                value={props.values.word}
                onChangeText={props.handleChange('word')}
              />}
              {generatedPassword && <Text style={{fontSize: 16, fontWeight: 700, textAlign: 'center'}}>{generatedPassword}</Text>}
              {message && <Text style={{color: 'red'}}>{message}</Text>}
              <View style={{ flexDirection: 'row', gap: 20}}>
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
                  Generate
                </Button>
              </View>   
              <Button 
                style={{ borderRadius: 4}} 
                labelStyle={{fontSize: 15, fontWeight: 600}}
                buttonColor='#f27d42' 
                mode="contained" 
                onPress={handleUsePassword}
              >
                Use Password
              </Button> 
            </View>
          )}
        </Formik>
      </Modal>
    </Portal>
  )
}
