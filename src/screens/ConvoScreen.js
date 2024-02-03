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

export default function ConvoScreen({ route }) {
  const { conversationId } = route.params;
  const { serverId } = route.params;
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loadingAIResponse, setLoadingAIResponse] = useState(false);

  const scrollViewRef = React.useRef();

  React.useEffect(() => {
    const loadMessages = async () => {
      try {
        const loadedMessages = await database.getMessagesById(conversationId);
        setConversation(loadedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [conversationId]);

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

      setConversation((prev) => [...prev, userMessage]);
      await database.insertMessage(conversationId, message, "user");

      setLoadingAIResponse(true);
      setMessage("");

      try {
        const completion = await fetchCompletion(
          serverId,
          message,
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
          <View
            key={index}
            style={msg.role === "user" ? styles.userMessage : styles.llmMessage}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
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
  userMessage: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 4,
    marginVertical: 5,
    alignSelf: "flex-end",
  },
  llmMessage: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 4,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  messageText: {
    color: "white",
  },
});
