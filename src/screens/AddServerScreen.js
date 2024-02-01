import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { database } from '../utils/database';

export default function AddServerScreen({ navigation }) {
  const [serverName, setServerName] = useState('');
  const [serverType, setServerType] = useState('Ollama');
  const [serverAddress, setServerAddress] = useState('');
  const [serverModel, setServerModel] = useState('');
  const [port, setPort] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleServerTypeChange = (newType) => {
    setServerType(newType);
    setPort(newType === 'Ollama' ? '11434' : newType === 'LMStudio' ? '1234' : newType === 'Jan' ? '1337' : '');
  };

  // const saveServerSettings = () => {
  //   database.insertServer(serverName, serverAddress, parseInt(port, 10), serverType, serverModel, (result) => {
  //     console.log('Server saved with ID:', result.insertId);
  //     navigation.navigate('ConvoSelectScreen', { serverId: result.insertId });
  //   });
  // };
  const saveServerSettings = async () => {
    try {
      const result = await database.insertServer(serverName, serverAddress, parseInt(port, 10), serverType, serverModel);
      console.log('Server added with ID:', result.insertId);
      navigation.navigate('ConvoSelectScreen', { serverId: result.insertId });
    } catch (error) {
      console.error('Error adding server:', error);
    }
  };
  

  return (
    <View style={styles.container}>

      {['Ollama', 'LMStudio', 'Jan', 'Other'].map((type) => (
        <Button key={type} title={type} onPress={() => handleServerTypeChange(type)} />
      ))}

      <TextInput
        style={styles.input}
        placeholder="Server Name"
        placeholderTextColor="#aaa"
        value={serverName}
        onChangeText={setServerName}
      />

      <TextInput
        style={styles.input}
        placeholder="Model"
        placeholderTextColor="#aaa"
        value={serverModel}
        onChangeText={setServerModel}
      />

      <TextInput
        style={styles.input}
        placeholder="Local Server Address"
        placeholderTextColor="#aaa"
        value={serverAddress}
        onChangeText={setServerAddress}
      />

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>How can I find my local server address?</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={{ marginTop: 50, marginHorizontal: 20, backgroundColor: 'white', padding: 20 }}>
          <Text>Instructions to find server's local IP:</Text>
          <Text>Windows: Use 'ipconfig' in CMD</Text>
          <Text>macOS: Use 'ifconfig' in Terminal</Text>
          <Text>Linux: Use 'hostname -I' in Terminal</Text>

          <Button title="Close" onPress={() => setModalVisible(!isModalVisible)} />
        </View>
      </Modal>
      <TextInput
        style={styles.input}
        placeholder="Port"
        placeholderTextColor="#aaa"
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
      />


      <Button title="Test Connection" onPress={() => { /* Test Connection Logic */ }} />
      <TouchableOpacity style={styles.button} onPress={saveServerSettings}>
        <Text style={styles.buttonText}>Add Server</Text>
      </TouchableOpacity>
    </View>
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
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    color: 'white',
  },
  button: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});