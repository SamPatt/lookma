import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { database } from '../utils/database';
import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
  const [servers, setServers] = useState([]);

  const fetchServers = async () => {
    try {
      const loadedServers = await database.getServers();
      setServers(loadedServers);
    } catch (error) {
      console.error('Error loading servers:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServers();
    }, [])
  );

  const showOptions = (serverId, serverName) => {
    Alert.alert(
      `${serverName}`,
      "Choose an option",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => showDeleteConfirmation(serverId, serverName) 
        },
        {
          text: "Edit / Duplicate",
          onPress: () => navigateToEditServerScreen(serverId)
        }
      ]
    );
  };

  const showDeleteConfirmation = (serverId, serverName) => {
    Alert.alert(
      "Delete Server",
      `Are you sure you want to delete ${serverName}? This deletes all associated conversations.`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => deleteServer(serverId) 
        }
      ]
    );
  };
  
  const deleteServer = async (serverId) => {
    try {
      await database.deleteServerAndRelatedData(serverId);
      refreshServers();
    } catch (error) {
      console.error('Error deleting server:', error);
      Alert.alert("Error", "Failed to delete server.");
    }
    checkDeletion(serverId);
  };
  

  const refreshServers = async () => {
    try {
      const loadedServers = await database.getServers();
      setServers(loadedServers); 
    } catch (error) {
      console.error('Error loading servers:', error);
    }
  };
  
  const checkDeletion = async (serverId) => {
    try {
      const servers = await database.getServers(); // Assuming this function fetches all servers
      console.log(servers); // Log the list of servers to see if the one you deleted is gone
  
      const conversations = await database.getConversations();
      console.log(conversations); // Check if conversations related to the server are deleted
  
      // You might need a function to fetch messages by serverId indirectly
      // For demonstration, this is a placeholder
      const messages = await database.getMessages();
      console.log(messages); // Check if messages related to the server's conversations are deleted
    } catch (error) {
      console.error('Error checking deletion:', error);
    }
  };
  


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {servers.map((server) => (
        <Card
        key={server.id}
        title={`${server.name}`}
        subtitle={`${server.type}  |  ${server.model}`}
        info={`${server.address}:${server.port}`}
        onPress={() => navigation.navigate('ConvoSelectScreen', { serverId: server.id })}
        onLongPress={() => showOptions(server.id, server.name)}
        />
        ))}
        
        <TouchableOpacity onPress={() => navigation.navigate('AddServerScreen')} style={styles.addServerButton}>
          <Text style={styles.addServerButtonText}>Add Local Server</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addServerButton: {
    backgroundColor: '#02a1bd',
    borderRadius: 5,
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
    marginTop: 20,
    padding: 10, 
    marginLeft: 6, 
  },
  addServerButtonText: {
    color: '#fff', 
    fontSize: 16, 
  },
});