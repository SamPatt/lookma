import * as api from './api';

export const startChat = async (initialMessages) => {
  // Define other parameters like temperature, max_tokens, and stream as per your app's logic
  const temperature = 0.7;
  const max_tokens = -1;
  const stream = false;

  return api.fetchCompletion(initialMessages, temperature, max_tokens, stream);
};

// Add more functions as needed for streaming responses, sending new messages, etc.
