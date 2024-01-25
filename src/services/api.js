import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = 'http://192.168.1.127:1234/v1/chat/completions'; // Replace with actual IP and port if necessary

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
        messages: [
          { "role": "system", "content": "Always answer in rhymes." },
          { "role": "user", "content": messages }
        ],
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
