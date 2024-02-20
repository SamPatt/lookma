import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("new_app8.db");

const init = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Servers
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS servers (" +
            "id INTEGER PRIMARY KEY NOT NULL, " +
            "name TEXT NOT NULL, " +
            "address TEXT NOT NULL, " +
            "port INTEGER NOT NULL, " +
            "type TEXT NOT NULL," +
            "model TEXT NOT NULL);"
        );

        // Conversations
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS conversations (" +
            "id INTEGER PRIMARY KEY NOT NULL, " +
            "server_id INTEGER NOT NULL, " +
            "title TEXT NOT NULL, " +
            "timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, " +
            "FOREIGN KEY (server_id) REFERENCES servers (id));"
        );

        // Messages
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS messages (" +
            "id INTEGER PRIMARY KEY NOT NULL, " +
            "conversation_id INTEGER NOT NULL, " +
            "content TEXT NOT NULL, " +
            "role TEXT NOT NULL, " +
            "timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, " +
            "FOREIGN KEY (conversation_id) REFERENCES conversations (id));"
        );
      },
      (error) => {
        console.error("Transaction error:", error);
        reject(error);
      },
      () => {
        console.log("Database initialization successful");
        resolve();
      }
    );
  });
};

const insertServer = async (name, address, port, type, model) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO servers (name, address, port, type, model) VALUES (?, ?, ?, ?, ?);",
        [name, address, port, type, model],
        (_, result) => resolve(result),
        (_, error) => {
          console.error("Error inserting server:", error);
          reject(error);
        }
      );
    });
  });
};

const updateServer = async (id, name, address, port, type, model) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE servers SET name = ?, address = ?, port = ?, type = ?, model = ? WHERE id = ?;",
        [name, address, port, type, model, id],
        (_, result) => {
          console.log("Server updated successfully");
          resolve(result);
        },
        (_, error) => {
          console.error("Error updating server:", error);
          reject(error);
        }
      );
    });
  });
};

const insertConversation = async (serverId, title) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO conversations (server_id, title) VALUES (?, ?);",
        [serverId, title],
        (_, result) => resolve(result),
        (_, error) => {
          console.error("Error inserting conversation:", error);
          reject(error);
        }
      );
    });
  });
};

const insertMessage = async (conversationId, content, role) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO messages (conversation_id, content, role) VALUES (?, ?, ?);",
        [conversationId, content, role],
        (_, result) => resolve(result),
        (_, error) => {
          console.error("Error inserting message:", error);
          reject(error);
        }
      );
    });
  });
};

const getServers = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM servers;",
        [],
        (_, result) => resolve(result.rows._array),
        (_, error) => {
          console.error("Error fetching servers:", error);
          reject(error);
        }
      );
    });
  });
};

const getServerById = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM servers WHERE id = ?;",
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.error("Error fetching server:", error);
          reject(error);
        }
      );
    });
  });
};

const deleteServerAndRelatedData = async (serverId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // First, delete all messages related to the server's conversations
      tx.executeSql(
        "DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE server_id = ?);",
        [serverId],
        null,
        (_, error) => {
          console.error("Error deleting messages for server:", error);
          reject(error);
        }
      );

      // Next, delete the conversations associated with the server
      tx.executeSql(
        "DELETE FROM conversations WHERE server_id = ?;",
        [serverId],
        null,
        (_, error) => {
          console.error("Error deleting conversations for server:", error);
          reject(error);
        }
      );

      // Finally, delete the server itself
      tx.executeSql(
        "DELETE FROM servers WHERE id = ?;",
        [serverId],
        (_, result) => resolve(result),
        (_, error) => {
          console.error("Error deleting server:", error);
          reject(error);
        }
      );
    });
  });
};

const getConversations = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM conversations;",
        [],
        (_, result) => resolve(result.rows._array),
        (_, error) => {
          console.error("Error fetching conversations:", error);
          reject(error);
        }
      );
    });
  });
};

const getConversationsById = async (serverId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM conversations WHERE server_id = ?;",
        [serverId],
        (_, result) => resolve(result.rows._array),
        (_, error) => {
          console.error("Error fetching conversations for server:", error);
          reject(error);
        }
      );
    });
  });
};

const getConversationsWithMessageCount = async (serverId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT c.id, c.server_id, c.title, c.timestamp, COUNT(m.id) AS messageCount
         FROM conversations c
         LEFT JOIN messages m ON c.id = m.conversation_id
         WHERE c.server_id = ?
         GROUP BY c.id;`,
        [serverId],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

const deleteConversationAndMessages = async (conversationId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM messages WHERE conversation_id = ?;", [
        conversationId,
      ]);
      tx.executeSql(
        "DELETE FROM conversations WHERE id = ?;",
        [conversationId],
        (_, result) => resolve(result),
        (_, error) => {
          console.error("Error deleting conversation and messages:", error);
          reject(error);
        }
      );
    });
  });
};

const updateConversationTitle = async (conversationId, newTitle) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE conversations SET title = ? WHERE id = ?;",
        [newTitle, conversationId],
        (_, result) => resolve(result),
        (_, error) => {
          console.error("Error updating conversation title:", error);
          reject(error);
        }
      );
    });
  });
};

const getMessages = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM messages;",
        [],
        (_, result) => resolve(result.rows._array),
        (_, error) => {
          console.error("Error fetching messages:", error);
          reject(error);
        }
      );
    });
  });
};

const getMessagesById = async (conversationId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM messages WHERE conversation_id = ?;",
        [conversationId],
        (_, result) => resolve(result.rows._array),
        (_, error) => {
          console.error("Error fetching messages for conversation:", error);
          reject(error);
        }
      );
    });
  });
};

export const database = {
  init,
  insertServer,
  updateServer,
  insertConversation,
  insertMessage,
  getServers,
  getServerById,
  deleteServerAndRelatedData,
  getConversations,
  getConversationsById,
  getConversationsWithMessageCount,
  deleteConversationAndMessages,
  updateConversationTitle,
  getMessages,
  getMessagesById,
};
