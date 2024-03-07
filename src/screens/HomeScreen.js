import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { database } from '../utils/database';
import Card from '../components/Card';

// Image credit: IYIKON, https://www.flaticon.com/free-icon/information_14873975

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

  const navigateToEditServerScreen = (serverId) => {
    navigation.navigate('EditServerScreen', { serverId });
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
  };
  

  const refreshServers = async () => {
    try {
      const loadedServers = await database.getServers();
      setServers(loadedServers); 
    } catch (error) {
      console.error('Error loading servers:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <Text style={styles.addServerButtonText}>Add Local Combo</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.aboutIcon} onPress={() => navigation.navigate('About')}>
        <Image source={require('../../assets/about-icon.png')} style={styles.aboutIconImage} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  aboutIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  aboutIconImage: {
    width: 40,
    height: 40,
  },
});