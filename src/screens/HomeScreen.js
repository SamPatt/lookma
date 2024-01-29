import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Servers</Text>
      </View>
      {servers.map((server) => (
        <Card
        key={server.id}
        title={`${server.name}`}
        subtitle={`${server.type}  |  ${server.model}`}
        info={`${server.address}:${server.port}`}
        onPress={() => navigation.navigate('ConvoSelectScreen', { serverId: server.id })}
        />
        ))}
        <Button
          title="Add Local Server"
          onPress={() => navigation.navigate('AddServerScreen')}
        />
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
});