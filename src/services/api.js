import { AsyncStorage } from 'react-native';

const SERVER_URL = 'http://localhost:1234/v1/chat/completions'; // Replace with actual IP and port

export const fetchCompletion = async (messages, temperature, max_tokens, stream) => {
  try {
    // Retrieve the server address from AsyncStorage if you allow users to set it
    const serverAddress = await AsyncStorage.getItem('serverAddress') || SERVER_URL;

    const response = await fetch(serverAddress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Any other headers that need to be set
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens,
        stream
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetching completion failed:', error);
    throw error;
  }
};
