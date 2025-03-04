import { database } from '../utils/database';

export const fetchCompletion = async (serverId, conversationHistory, temperature, max_tokens, stream) => {
  try {
    // Await the server details
    const server = await database.getServerById(serverId);
    if (!server) {
      console.log('Server not found');
      return; // or throw new Error('Server not found');
    }

    // Determine protocol (https if the address already includes it, otherwise http)
    const protocol = server.address.startsWith('https://') ? '' : 
                     server.address.startsWith('http://') ? '' : 'http://';
    
    // Construct the server address
    const cleanAddress = server.address.replace(/^https?:\/\//, '');
    const serverAddress = `${protocol}${cleanAddress}:${server.port}/v1/chat/completions`;
    
    console.log('Connecting to:', serverAddress);
    
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
    // Determine protocol (https if the address already includes it, otherwise http)
    const protocol = localAddress.startsWith('https://') ? '' : 
                     localAddress.startsWith('http://') ? '' : 'http://';
    
    // Construct the server address
    const cleanAddress = localAddress.replace(/^https?:\/\//, '');
    const serverAddress = `${protocol}${cleanAddress}:${serverPort}/v1/chat/completions`;
    
    console.log('Testing connection to:', serverAddress);
    
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
