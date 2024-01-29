import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { fetchCompletion } from '../services/api';

export default function ConvoScreen({ route, navigation}) {
  const { serverId } = route.params;
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);


  const sendMessage = async () => {
    if (message.trim()) {
      // Add user message to conversation
      setConversation(prev => [...prev, { role: 'user', content: message }]);
  
      try {
        const completion = await fetchCompletion(serverId, message, 0.7, -1, false);
        let responseContent = 'No valid response from server';
  
        // Extracting the content from the response
        if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
          responseContent = completion.choices[0].message.content;
        }
  
        // Add LLM response to conversation
        setConversation(prev => [...prev, { role: 'assistant', content: responseContent }]);
      } catch (error) {
        console.error('Error sending message:', error);
        // Add error message to conversation
        setConversation(prev => [...prev, { role: 'assistant', content: 'Error sending message' }]);
      }
  
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {conversation.map((msg, index) => (
          <View key={index} style={msg.role === 'user' ? styles.userMessage : styles.llmMessage}>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setMessage}
          value={message}
          placeholder="Type your message"
          placeholderTextColor="#aaa"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
    padding: 10,
    marginRight: 10,
    borderRadius: 4,
  },
  userMessage: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 4,
    marginVertical: 5,
    alignSelf: 'flex-end',
  },
  llmMessage: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 4,
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
  },
});
