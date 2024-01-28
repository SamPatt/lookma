import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadServerSettings = async () => {
  try {
    const settingsJson = await AsyncStorage.getItem('@server_settings');
    if (settingsJson !== null) {
      const settings = JSON.parse(settingsJson);
      console.log('Loaded server settings:', settings)
    }
  } catch (e) {
    // error reading value
    console.error('Error loading server settings:', e);
  }
}

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Add Server"
        onPress={() => navigation.navigate('AddServerScreen')}
      />
      <Button
        title="Go to Conversation Select"
        onPress={() => navigation.navigate('ConvoSelectScreen')}
      />
    </View>
  );
}

loadServerSettings();
