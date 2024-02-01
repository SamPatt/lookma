import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('new_app6.db');


const init = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS servers (' +
            'id INTEGER PRIMARY KEY NOT NULL, ' +
            'name TEXT NOT NULL, ' +
            'address TEXT NOT NULL, ' +
            'port INTEGER NOT NULL, ' +
            'type TEXT NOT NULL,' +
            'model TEXT NOT NULL);'
          );
      
          // Create Conversations Table
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS conversations (' +
            'id INTEGER PRIMARY KEY NOT NULL, ' +
            'server_id INTEGER NOT NULL, ' +
            'title TEXT NOT NULL, ' +
            'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY (server_id) REFERENCES servers (id));'
          );
      
          // Create Messages Table
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS messages (' +
            'id INTEGER PRIMARY KEY NOT NULL, ' +
            'conversation_id INTEGER NOT NULL, ' +
            'content TEXT NOT NULL, ' +
            'role TEXT NOT NULL, ' +
            'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
            'FOREIGN KEY (conversation_id) REFERENCES conversations (id));'
          );
  
      }, (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }, () => {
        console.log('Database initialization successful');
        resolve();
      });
    });
  };

  const insertServer = async (name, address, port, type, model) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO servers (name, address, port, type, model) VALUES (?, ?, ?, ?, ?);',
          [name, address, port, type, model],
          (_, result) => resolve(result),
          (_, error) => {
            console.error('Error inserting server:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  
  const insertConversation = async (serverId, title) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO conversations (server_id, title) VALUES (?, ?);',
          [serverId, title],
          (_, result) => resolve(result),
          (_, error) => {
            console.error('Error inserting conversation:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  
  const insertMessage = async (conversationId, content, role) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO messages (conversation_id, content, role) VALUES (?, ?, ?);',
          [conversationId, content, role],
          (_, result) => resolve(result),
          (_, error) => {
            console.error('Error inserting message:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  
  
  const getServers = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM servers;',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            console.error('Error fetching servers:', error);
            reject(error);
          }
        );
      });
    });
  };  
  
  const getServerById = async (id) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM servers WHERE id = ?;',
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0));
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            console.error('Error fetching server:', error);
            reject(error);
          }
        );
      });
    });
  };  
  

  const getConversations = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM conversations;',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            console.error('Error fetching conversations:', error);
            reject(error);
          }
        );
      });
    });
  };

  const getConversationsById = async (serverId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM conversations WHERE server_id = ?;',
          [serverId],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            console.error('Error fetching conversations for server:', error);
            reject(error);
          }
        );
      });
    });
  };  
  
  const getMessages = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM messages;',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            console.error('Error fetching messages:', error);
            reject(error);
          }
        );
      });
    });
  };

  const getMessagesById = async (conversationId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM messages WHERE conversation_id = ?;',
          [conversationId],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            console.error('Error fetching messages for conversation:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  
  
export const database = {
    init,
    insertServer,
    insertConversation,
    insertMessage,
    getServers,
    getServerById,
    getConversations,
    getConversationsById,
    getMessages,
    getMessagesById,
};
  