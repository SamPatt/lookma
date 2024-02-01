import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchCompletion } from '../services/api';

export default function ConvoScreen({ route }) {
  const { serverId } = route.params;
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const scrollViewRef = React.useRef();
  
  const sendMessage = async () => {
    if (message.trim()) {
      // Add user message to conversation
      setConversation(prev => [...prev, { role: 'user', content: message }]);
      let tempMessage = message;
      // Clear the message input after sending
      setMessage('');
      try {
        const completion = await fetchCompletion(serverId, tempMessage, 0.7, 150, false);
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

      
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
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
          placeholder="Type your message here..."
          placeholderTextColor="#aaa"
          multiline
        />
         <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    height: 'auto',
    maxHeight: 100, 
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: 'white',
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#02a1bd',
    borderRadius: 5,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10, 
    marginLeft: 6, 
  },
  sendButtonText: {
    color: '#fff', 
    fontSize: 16, 
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
