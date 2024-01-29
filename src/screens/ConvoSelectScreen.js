import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ConvoSelectScreen({ route, navigation }) {
  const { serverId } = route.params;
  console.log('serverId in ConvoSelect', serverId);
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Conversation Select Screen</Text>
      <Button
        title="Go to Conversation"
        onPress={() => navigation.navigate('ConvoScreen', { serverId: serverId})}
      />
    </View>
  );
}
