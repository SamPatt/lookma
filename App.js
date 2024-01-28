import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ConvoSelectScreen from './src/screens/ConvoSelectScreen';
import ConvoScreen from './src/screens/ConvoScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddServerScreen from './src/screens/AddServerScreen';
import { database } from './src/utils/database';

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    database.init();

    // // Insert a test server
    // database.insertServer("Test Server", "127.0.0.1", 1234, "Model X", serverResult => {
    //   console.log("Server inserted, ID:", serverResult.insertId);

    //   // Insert a test conversation
    //   database.insertConversation(serverResult.insertId, "Test Conversation", conversationResult => {
    //     console.log("Conversation inserted, ID:", conversationResult.insertId);

    //     // Insert a test message
    //     database.insertMessage(conversationResult.insertId, "Hello, SQLite!", "user", messageResult => {
    //       console.log("Message inserted, ID:", messageResult.insertId);

    //       // Retrieve and log all data
    //       database.getServers(servers => {
    //         console.log("Servers:", servers);
    //         database.getConversations(conversations => {
    //           console.log("Conversations:", conversations);
    //           database.getMessages(messages => {
    //             console.log("Messages:", messages);
    //           });
    //         });
    //       });
    //     });
    //   });
    // });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ConvoSelectScreen" component={ConvoSelectScreen} />
        <Stack.Screen name="ConvoScreen" component={ConvoScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddServerScreen" component={AddServerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}