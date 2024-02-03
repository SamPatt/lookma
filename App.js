import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import ConvoSelectScreen from "./src/screens/ConvoSelectScreen";
import ConvoScreen from "./src/screens/ConvoScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AddServerScreen from "./src/screens/AddServerScreen";
import EditServerScreen from "./src/screens/EditServerScreen";
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
      }
    };

    initializeDatabase();

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
            backgroundColor: "#A12516", 
          },
          headerTintColor: "#fff", 
          headerTitleStyle: {
            fontWeight: "bold",
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
        <Stack.Screen
          name="EditServerScreen"
          component={EditServerScreen}
          options={{ title: "Edit / Duplicate Server" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
