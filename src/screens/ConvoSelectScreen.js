import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ConvoSelectScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Conversation Select Screen</Text>
      <Button
        title="Go to Conversation"
        onPress={() => navigation.navigate('ConvoScreen')}
      />
    </View>
  );
}
