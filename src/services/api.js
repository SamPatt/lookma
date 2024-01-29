import { database } from '../utils/database';

export const fetchCompletion = async (serverId, messages, temperature, max_tokens, stream) => {
  try {
    // Await the server details
    const server = await database.getServerById(serverId);
    if (!server) {
      console.log('Server not found');
      return; // or throw new Error('Server not found');
    }

    // Construct the server address
    const serverAddress = `http://${server.address}:${server.port}/v1/chat/completions`;

    // Fetch request
    const response = await fetch(serverAddress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
