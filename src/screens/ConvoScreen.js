import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchCompletion } from '../services/api';
import { database } from '../utils/database';

export default function ConvoScreen({ route }) {
  const { conversationId } = route.params;
  const { serverId } = route.params;
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const scrollViewRef = React.useRef();
  
  React.useEffect(() => {
    const loadMessages = async () => {
      try {
        const loadedMessages = await database.getMessagesById(conversationId);
        setConversation(loadedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [conversationId]);

  const sendMessage = async () => {
    if (message.trim()) {
      const userMessage = { conversation_id: conversationId, content: message, role: 'user' };
      
      // Check if this is the first message in the conversation
      if (conversation.length === 0) {
        // This is the first message, so update the conversation title
        const newTitle = message.substring(0, 30); // Use the first 30 characters of the message
        await database.updateConversationTitle(conversationId, newTitle);
      }
  
      // Proceed to add user message to conversation and database
      setConversation(prev => [...prev, userMessage]);
      await database.insertMessage(conversationId, message, 'user');
  
      // Clear the message input after sending
      setMessage('');
  
      try {
        const completion = await fetchCompletion(serverId, message, 0.7, 150, false);
        let responseContent = 'No valid response from server';
  
        // Extracting the content from the response
        if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
          responseContent = completion.choices[0].message.content;
        }
  
        // Update AI message and add to conversation and database
        const aiMessage = { conversation_id: conversationId, content: responseContent, role: 'assistant' };
        setConversation(prev => [...prev, aiMessage]);
        await database.insertMessage(conversationId, responseContent, 'assistant');
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error for message sending failure
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
