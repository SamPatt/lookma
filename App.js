import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { fetchCompletion } from './src/services/api'; // Adjust the path as necessary

export default function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    try {
      const completion = await fetchCompletion(message, 0.7, 150, false);
      // Extracting the content from the response
      if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
        setResponse(completion.choices[0].message.content);
      } else {
        setResponse('No valid response from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse('Error sending message');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>LookMa AI</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMessage}
        value={message}
        placeholder="Type your message"
      />
      <Button
        title="Send Message"
        onPress={sendMessage}
      />
      <ScrollView style={styles.responseContainer}>
        <Text style={styles.responseText}>{response}</Text>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textStyle: {
    color: '#757575',
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'white',
    borderColor: 'gray',
    width: '100%',
  },
  responseContainer: {
    marginTop: 20,
    width: '100%',
  },
  responseText: {
    color: '#757575',
  },
});
