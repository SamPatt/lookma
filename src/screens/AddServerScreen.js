import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { database } from '../utils/database';

export default function AddServerScreen({ navigation }) {
  const [serverName, setServerName] = useState('');
  const [serverType, setServerType] = useState('Ollama');
  const [serverAddress, setServerAddress] = useState('');
  const [port, setPort] = useState(serverType === 'Ollama' ? '11434' : serverType === 'LMStudio' ? '1234' : '');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleServerTypeChange = (newType) => {
    setServerType(newType);
    setPort(newType === 'Ollama' ? '11434' : newType === 'LMStudio' ? '1234' : newType === 'Jan' ? '1337' : '');
  };

  const saveServerSettings = () => {
    database.insertServer(serverName, serverAddress, parseInt(port, 10), serverType, (result) => {
      console.log('Server saved with ID:', result.insertId);
      navigation.goBack();
    });
  };  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Server Type</Text>
      {/* Implement a dropdown here. For simplicity, using buttons */}
      <View>
        {['Ollama', 'LMStudio', 'Jan', 'Other'].map((type) => (
          <Button key={type} title={type} onPress={() => handleServerTypeChange(type)} />
        ))}
      </View>


      <Text>Server Name</Text>

      <TextInput
        placeholder="Server Name"
        value={serverName}
        onChangeText={setServerName}
      />

      <TextInput
        placeholder="Local Server Address"
        value={serverAddress}
        onChangeText={setServerAddress}
      />

      <TextInput
        placeholder="Port"
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>How can I find this?</Text>
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

      <Button title="Test Connection" onPress={() => { /* Test Connection Logic */ }} />
      <Button title="Add Server" onPress={saveServerSettings} />
    </View>
  );
}
