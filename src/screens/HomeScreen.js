import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { database } from '../utils/database';
import Card from '../components/Card';

export default function HomeScreen({ navigation }) {
  const [servers, setServers] = useState([]);

  React.useEffect(() => {
    database.getServers((loadedServers) => {
      setServers(loadedServers);
    }, (error) => {
      console.error('Error loading server settings:', error);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Servers</Text>
        <Button
          title="Add Server"
          onPress={() => navigation.navigate('AddServerScreen')}
        />
      </View>
      {servers.map((server) => (
        <Card
          key={server.id}
          title={server.name}
          subtitle={`Address: ${server.address}`}
          onPress={() => navigation.navigate('ConvoSelectScreen', { serverId: server.id })}
        />
      ))}
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
  // Add other styles if needed...
});