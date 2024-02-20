import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { fetchCompletion } from "../services/api";
import { database } from "../utils/database";
import { timeSince } from "../utils/timeSince";

export default function ConvoScreen({ route }) {
  const { conversationId } = route.params;
  const { serverId } = route.params;
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loadingAIResponse, setLoadingAIResponse] = useState(false);
  const [error, setError] = useState("");
  const [serverModel, setServerModel] = useState("");

  const scrollViewRef = React.useRef();

  useEffect(() => {
    const fetchServerDetails = async () => {
      const serverDetails = await database.getServerById(serverId);
      if (serverDetails) {
        setServerModel(serverDetails.model);
      }
    };

    const loadMessages = async () => {
      try {
        const loadedMessages = await database.getMessagesById(conversationId);
        // Assuming loadedMessages contains timestamp for each message
        const updatedMessages = loadedMessages.map((msg) => ({
          ...msg,
          timeSince: timeSince(msg.timestamp),
        }));
        setConversation(updatedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchServerDetails();
    loadMessages();
  }, [conversationId, serverId]);

  const sendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        conversation_id: conversationId,
        content: message,
        role: "user",
      };

      if (conversation.length === 0) {
        const newTitle = message.substring(0, 30);
        await database.updateConversationTitle(conversationId, newTitle);
      }

      const conversationHistory = conversation
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))
        .concat(userMessage);

      setConversation((prev) => [...prev, userMessage]);
      await database.insertMessage(conversationId, message, "user");

      setLoadingAIResponse(true);
      setMessage("");

      try {
        const completion = await fetchCompletion(
          serverId,
          conversationHistory,
          0.7,
          150,
          false
        );
        let responseContent = "No valid response from server";

        if (
          completion.choices &&
          completion.choices.length > 0 &&
          completion.choices[0].message
        ) {
          responseContent = completion.choices[0].message.content;
        }

        const aiMessage = {
          conversation_id: conversationId,
          content: responseContent,
          role: "assistant",
        };
        setConversation((prev) => [...prev, aiMessage]);
        await database.insertMessage(
          conversationId,
          responseContent,
          "assistant"
        );
      } catch (error) {
        console.error("Error sending message:", error);
        setError(
          "Could not connect to the server. Ensure server is running and settings are correct."
        );
      }
      setLoadingAIResponse(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {conversation.map((msg, index) => (
          <View key={index} style={styles.messageBlock}>
            <View style={styles.metadataContainer}>
              {/* Model Name and Time Since for AI Messages */}
              {msg.role === "assistant" && (
                <View style={styles.metadataInnerContainer}>
                  <Text style={styles.modelNameTextLeft}>{serverModel}</Text>
                  {msg.timeSince && (
                    <Text style={styles.timeSinceTextLeft}>
                      {"  " + msg.timeSince}
                    </Text>
                  )}
                </View>
              )}

              {/* Time Since for User Messages */}
              {msg.role === "user" && msg.timeSince && (
                <Text style={styles.timeSinceTextRight}>{msg.timeSince}</Text>
              )}
            </View>

            {/* Message Content */}
            <View
              style={
                msg.role === "user" ? styles.userMessage : styles.llmMessage
              }
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          </View>
        ))}

        {loadingAIResponse && (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
            style={{ marginVertical: 20 }}
          />
        )}
      </ScrollView>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
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
    backgroundColor: "#121212",
    padding: 20,
  },
  messagesContainer: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    height: "auto",
    maxHeight: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: "white",
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#02a1bd",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginLeft: 6,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  messageBlock: {
    marginBottom: 10, // Space between each message block
  },

  timeSinceTextRight: {
    alignSelf: "flex-end",
    color: "#696969",
    fontSize: 10,
    marginRight: 10,
    marginBottom: 5,
  },

  timeSinceTextLeft: {
    color: "#696969",
    fontSize: 10,
  },

  modelNameTextLeft: {
    alignSelf: "flex-start",
    color: "#aaa",
    fontSize: 14,
    marginLeft: 10,
  },

  userMessage: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 4,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },

  llmMessage: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 4,
    alignSelf: "flex-start",
    maxWidth: "90%",
  },

  messageText: {
    color: "white",
  },

  metadataInnerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
  },
});
