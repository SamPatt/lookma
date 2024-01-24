import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import * as chatService from '../services/chatService';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    try {
      const newMessages = [
        // ... your existing messages,
        { role: 'user', content: inputText },
      ];
      const response = await chatService.startChat(newMessages);
      setMessages([
        ...messages,
        // Add the assistant's response
        response.choices[0].message,
      ]);
      setInputText('');
    } catch (error) {
      // Handle error (e.g., show an alert)
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => `message-${index}`}
        renderItem={({ item }) => (
          <Text>{`${item.role}: ${item.content}`}</Text>
        )}
      />
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        // additional TextInput props
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
}
