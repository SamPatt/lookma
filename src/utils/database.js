import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('new_app4.db');

const init = () => {
    db.transaction(tx => {
      // Create Servers Table
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
        'text TEXT NOT NULL, ' +
        'role TEXT NOT NULL, ' +
        'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
        'FOREIGN KEY (conversation_id) REFERENCES conversations (id));'
      );
    }, (error) => { console.log('Transaction error:', error); }, () => { console.log('Database initialization successful'); });
  };

  const insertServer = (name, address, port, type, model, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO servers (name, address, port, type, model) VALUES (?, ?, ?, ?, ?);', // Five placeholders for five values
        [name, address, port, type, model],
        (_, result) => callback && callback(result),
        (_, error) => console.error('Error inserting server:', error)
      );
    });
  };
  
  
  const insertConversation = (serverId, title, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO conversations (server_id, title) VALUES (?, ?);',
        [serverId, title],
        (_, result) => callback && callback(result),
        (_, error) => console.error('Error inserting conversation:', error)
      );
    });
  };
  
  const insertMessage = (conversationId, text, role, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO messages (conversation_id, text, role) VALUES (?, ?, ?);',
        [conversationId, text, role],
        (_, result) => callback && callback(result),
        (_, error) => console.error('Error inserting message:', error)
      );
    });
  };
  
  const getServers = (callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM servers;',
        [],
        (_, result) => callback && callback(result.rows._array),
        (_, error) => console.error('Error fetching servers:', error)
      );
    });
  };
  
  const getConversations = (callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM conversations;',
        [],
        (_, result) => callback && callback(result.rows._array),
        (_, error) => console.error('Error fetching conversations:', error)
      );
    });
  };
  
  const getMessages = (callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages;',
        [],
        (_, result) => callback && callback(result.rows._array),
        (_, error) => console.error('Error fetching messages:', error)
      );
    });
  };
  
export const database = {
    init,
    insertServer,
    insertConversation,
    insertMessage,
    getServers,
    getConversations,
    getMessages,
};
  