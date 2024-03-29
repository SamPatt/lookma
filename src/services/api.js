import { database } from '../utils/database';

export const fetchCompletion = async (serverId, conversationHistory, temperature, max_tokens, stream) => {
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
        // Directly use conversationHistory which is now an array of {role, content}
        messages: conversationHistory,
        model: server.model,
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


export const testConnection = async (localAddress, serverPort, serverModel, temperature, max_tokens, stream) => {
  try {
    const serverAddress = `http://${localAddress}:${serverPort}/v1/chat/completions`;
    const model = serverModel;
    const response = await fetch(serverAddress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { "role": "system", "content": "Always respond with 'TEST'." },
          { "role": "user", "content": "Hello" }
        ],
        model,
        temperature,
        max_tokens,
        stream
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Fetching completion failed:', error);
    return false;
  }
};
