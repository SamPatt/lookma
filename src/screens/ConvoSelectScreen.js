import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { database } from "../utils/database";
import { timeSince } from "../utils/timeSince";
import { Alert } from "react-native";

export default function ConvoSelectScreen({ route, navigation }) {
  const { serverId } = route.params;
  const [conversations, setConversations] = useState([]);
  const isFocused = useIsFocused();
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);

  const deleteConversation = async (conversationId) => {
    try {
      await database.deleteConversationAndMessages(conversationId);
      setSelectedForDeletion(null);
      loadConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const showDeleteConfirmation = (conversationId) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation and all its messages?",
      [
        {
          text: "Cancel",
          onPress: () => setSelectedForDeletion(null),
          style: "cancel",
        },
        { text: "Delete", onPress: () => deleteConversation(conversationId) },
      ]
    );
  };

  useEffect(() => {
    if (isFocused) {
      loadConversations();
    }
  }, [isFocused]);

  const loadConversations = async () => {
    try {
      const loadedConversations =
        await database.getConversationsWithMessageCount(serverId);
      const conversationsWithExtras = loadedConversations.map(
        (conversation) => ({
          ...conversation,
          timeSinceStarted: timeSince(conversation.timestamp),
        })
      );
      setConversations(conversationsWithExtras);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const handleNewConversation = async () => {
    try {
      // Assuming 'Untitled Conversation' as the default title for new conversations
      const result = await database.insertConversation(
        serverId,
        "Untitled Conversation"
      );
      if (result && result.insertId) {
        loadConversations(); // Refresh the list of conversations
        navigation.navigate("ConvoScreen", {
          serverId: serverId,
          conversationId: result.insertId,
        });
      }
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationButton}
            onPress={() =>
              navigation.navigate("ConvoScreen", {
                serverId: serverId,
                conversationId: conversation.id,
              })
            }
            onLongPress={() => setSelectedForDeletion(conversation.id)}
          >
            <View style={styles.conversationHeader}>
              <Text style={styles.conversationText}>{conversation.title}</Text>
              {selectedForDeletion === conversation.id && (
                <TouchableOpacity onPress={() => showDeleteConfirmation(conversation.id)} style={styles.deleteIcon}>
                  <Text style={styles.deleteIconText}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.conversationFooter}>
              <Text style={styles.messageCount}>{conversation.messageCount} messages</Text>
              <Text style={styles.timeSince}>{conversation.timeSinceStarted}</Text>
            </View>
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
    backgroundColor: "#121212",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  conversationDetails: {
    color: '#aaa',
    fontSize: 14, 
    marginTop: 4, 
    flexShrink: 1, 
  },
  conversationButton: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'flex-start', // Align items to the start of the container
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space between items
    width: '100%', // Ensure full width usage
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure full width usage
    marginTop: 8, // Provide some space between the title and the footer
  },
  conversationText: {
    color: '#fff',
    fontSize: 16,
    flex: 1, // Take up available space
  },
  messageCount: {
    color: '#aaa',
    fontSize: 14,
  },
  timeSince: {
    color: '#aaa',
    fontSize: 14,
  },
  deleteIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  deleteIconText: {
    fontSize: 24,
    color: 'red',
  },
  newConversationButton: {
    backgroundColor: '#02a1bd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
