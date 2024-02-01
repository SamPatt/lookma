import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { database } from '../utils/database';

export default function ConvoSelectScreen({ route, navigation }) {
  const { serverId } = route.params;
  const [conversations, setConversations] = useState([]);

  React.useEffect(() => {
    loadConversations();
  }, [serverId]);

  const loadConversations = async () => {
    try {
      const loadedConversations = await database.getConversationsById(serverId);
      setConversations(loadedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleNewConversation = async () => {
    try {
      // Assuming 'Untitled Conversation' as the default title for new conversations
      const result = await database.insertConversation(serverId, 'Untitled Conversation');
      if (result && result.insertId) {
        loadConversations(); // Refresh the list of conversations
        navigation.navigate('ConvoScreen', { serverId: serverId, conversationId: result.insertId });
      }
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select a Conversation</Text>
      <ScrollView style={styles.scrollView}>
        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationButton}
            onPress={() => navigation.navigate('ConvoScreen', { serverId: serverId, conversationId: conversation.id })}
          >
            <Text style={styles.conversationText}>{conversation.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.newConversationButton}
        onPress={handleNewConversation}
      >
        <Text style={styles.buttonText}>Start New Conversation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  conversationButton: {
    backgroundColor: '#02a1bd',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  conversationText: {
    color: '#fff',
    fontSize: 16,
  },
  newConversationButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
