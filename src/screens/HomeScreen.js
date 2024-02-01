import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { database } from '../utils/database';
import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
  const [servers, setServers] = useState([]);

  React.useEffect(() => {
    const fetchServers = async () => {
      try {
        const loadedServers = await database.getServers();
        setServers(loadedServers);
      } catch (error) {
        console.error('Error loading server settings:', error);
      }
    };

    fetchServers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {servers.map((server) => (
        <Card
        key={server.id}
        title={`${server.name}`}
        subtitle={`${server.type}  |  ${server.model}`}
        info={`${server.address}:${server.port}`}
        onPress={() => navigation.navigate('ConvoSelectScreen', { serverId: server.id })}
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
    padding: 10, 
    marginLeft: 6, 
  },
  addServerButtonText: {
    color: '#fff', 
    fontSize: 16, 
  },
});