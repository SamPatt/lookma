import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import ConvoSelectScreen from "./src/screens/ConvoSelectScreen";
import ConvoScreen from "./src/screens/ConvoScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AddServerScreen from "./src/screens/AddServerScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import { database } from "./src/utils/database";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await database.init();
        setIsLoading(false);
      } catch (error) {
        console.error("Database initialization failed:", error);
        // Handle the error as appropriate for your app
      }
    };

    initializeDatabase();

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
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#A12516", // Set your custom color
          },
          headerTintColor: "#fff", // Set the color of the header title and icons (if any) to white
          headerTitleStyle: {
            fontWeight: "bold", // Optional: if you want the title to be bold
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Servers" }}
        />
        <Stack.Screen
          name="ConvoSelectScreen"
          component={ConvoSelectScreen}
          options={{ title: "Conversations" }}
        />
        <Stack.Screen
          name="ConvoScreen"
          component={ConvoScreen}
          options={{ title: "Chat" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
        <Stack.Screen
          name="AddServerScreen"
          component={AddServerScreen}
          options={{ title: "Add Server" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
