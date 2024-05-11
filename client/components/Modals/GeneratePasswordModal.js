import React, { useState } from 'react'
import { Modal, Portal, Button, TextInput, Switch } from 'react-native-paper';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';

export default function GeneratePasswordModal({ onDismiss,visible, usePassword }) {
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isUseWord, setIsUseWord] = React.useState(false);

  const handleUsePassword = () => {
    if (generatedPassword) {
      usePassword(generatedPassword);
    }
  };
  const dismiss =() => {
    onDismiss(); 
    setGeneratedPassword('')
    setIsUseWord(false)
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={dismiss} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
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
              <Text style={{ fontSize: 30, fontWeight: '800', color: '#333', marginBottom: 20, textAlign: 'center' }}>
                Generate Password
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>Customize with Word</Text>
                <Switch value={isUseWord} onValueChange={() => setIsUseWord(!isUseWord)} />
              </View>
              {isUseWord && <TextInput
                mode="outlined"
                label="Enter Word or Phrase"
                value={props.values.word}
                onChangeText={props.handleChange('word')}
              />}
              {generatedPassword && <Text style={{fontSize: 16, fontWeight: 700, textAlign: 'center'}}>{generatedPassword}</Text>}
              {message && <Text style={{color: 'red'}}>{message}</Text>}
              <View style={{ flexDirection: 'row', gap: 20}}>
                <Button style={{flex: 1, borderRadius: 4}} mode="contained" onPress={()=>{onDismiss();setMessage('');}}>
                  <Text style={{fontSize: 15, fontWeight: 600}}>Cancel</Text>
                </Button>
                <Button style={{flex: 1, borderRadius: 4}} loading={isLoading} mode="contained" onPress={props.handleSubmit}>
                  <Text style={{fontSize: 15, fontWeight: 600}}>Generate</Text>
                </Button>
              </View>   
              <View>
                <Button style={{ borderRadius: 4}} mode="contained" onPress={handleUsePassword}>
                  <Text style={{fontSize: 15, fontWeight: 600}}>Use Password</Text>
                </Button>    
              </View>
            </View>
          )}
        </Formik>
      </Modal>
    </Portal>
  )
}
