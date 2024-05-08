import React from 'react';
import { IconButton } from 'react-native-paper';
import { View, Text, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 35 }}>
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ backgroundColor: '#ae64d9', borderRadius: 2, padding: 5 }}>
          <Text style={{ fontSize: 30, fontWeight: '600', color: '#fff' }}>Welcome</Text>
        </View>
        {/* 
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require('../assets/icon.png')}
            style={{ width: 35, height: 35 }}
            imageStyle={{ borderRadius: 25 }}
          />
        </TouchableOpacity> 
        */}
      </View>
    </SafeAreaView>
  );
}
