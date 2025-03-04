import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { database } from "../utils/database";
import { testConnection } from "../services/api";

export default function AddServerScreen({ navigation }) {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("Select Server App");
  const [useHttps, setUseHttps] = useState(false);
  const [serverAddress, setServerAddress] = useState("");
  const [serverModel, setServerModel] = useState("");
  const [port, setPort] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [testConnectionSuccess, setTestConnectionSuccess] = useState(false);
  const [loadingAIResponse, setLoadingAIResponse] = useState(false);

  const testServerConnection = async () => {
    if (
      !serverName ||
      !serverAddress ||
      !port ||
      serverType === "Select Server App" ||
      !serverModel
    ) {
      // Alert the user that all fields are required
      Alert.alert("Missing Information", "Please fill in all fields.");
      return; // Stop the function from proceeding
    }
    setLoadingAIResponse(true);

    try {
      const success = await testConnection(serverAddress, port, serverModel, 0.7, 150, false)
      setTestConnectionSuccess(success);
      setLoadingAIResponse(false);
      if (success) {
        // Alert.alert("Success", "Connection to server successful!");
      } else {
        Alert.alert("Failed", "Could not connect to the server. Please ensure your server is running, check your inputs, and try again.");
      }
    } catch (error) {
      console.error("Test connection error:", error);
      Alert.alert("Error", "An error occurred while testing the connection.");
    }
  };

  const handleServerTypeChange = (newType) => {
    setServerType(newType);
    setPort(
      newType === "Ollama"
        ? "11434"
        : newType === "LMStudio"
        ? "1234"
        : newType === "Jan"
        ? "1337"
        : ""
    );
  };

  const saveServerSettings = async () => {
    if (
      !serverName ||
      !serverAddress ||
      !port ||
      serverType === "Select Server App" ||
      !serverModel
    ) {
      // Alert the user that all fields are required
      Alert.alert("Missing Information", "Please fill in all fields.");
      return; // Stop the function from proceeding
    }

    try {
      const result = await database.insertServer(
        serverName,
        serverAddress,
        parseInt(port, 10),
        serverType,
        serverModel
      );
      console.log("Server added with ID:", result.insertId);
      navigation.navigate("ConvoSelectScreen", { serverId: result.insertId });
    } catch (error) {
      console.error("Error adding server:", error);
      Alert.alert(
        "Error",
        "Failed to add server. Please check your inputs and try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name for your combo"
        placeholderTextColor="#aaa"
        value={serverName}
        onChangeText={setServerName}
      />

      <TextInput
        style={styles.input}
        placeholder="Model, e.g., tinyllama-1.1b"
        placeholderTextColor="#aaa"
        value={serverModel}
        onChangeText={setServerModel}
      />

      <TextInput
        style={styles.input}
        placeholder="Local Server Address (e.g. 192.168.1.10 or https://example.com)"
        placeholderTextColor="#aaa"
        value={serverAddress}
        onChangeText={setServerAddress}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.tooltipText}>
          How can I find my local server address?
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Your local IP usually looks like 192.168.x.x; you can find it by
            running the following commands:
          </Text>
          <Text style={styles.modalText}>* Windows: Use 'ipconfig' in CMD</Text>
          <Text style={styles.modalText}>
            * macOS / Linux: Use 'ifconfig' in Terminal
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!isModalVisible)}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={serverType}
          style={styles.pickerStyle}
          itemStyle={{ color: "white" }}
          onValueChange={(itemValue, itemIndex) =>
            handleServerTypeChange(itemValue)
          }
        >
          <Picker.Item label="Select Server App" value="Select Server App" />
          <Picker.Item label="Ollama" value="Ollama" />
          <Picker.Item label="LMStudio" value="LMStudio" />
          <Picker.Item label="Jan" value="Jan" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Port"
        placeholderTextColor="#aaa"
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
      />

      {testConnectionSuccess ? (
        <View style={styles.successButton}>
          <Text style={styles.buttonText}>Connected ✔️</Text>
        </View>
      ) : (

        loadingAIResponse ? (
          <ActivityIndicator size="large" color="#02a1bd" />
        ) : (
        <TouchableOpacity
          style={styles.testButton}
          onPress={testServerConnection}
          color={testConnectionSuccess ? "green" : "#02a1bd"}>
        <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
        )
      )}

      <TouchableOpacity style={styles.button} onPress={saveServerSettings}>
        <Text style={styles.buttonText}>Save Server</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 50, // Increased height for better touch area
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#02a1bd", // Adjusted border color to match the "new conversation" button
    borderRadius: 5,
    padding: 10,
    color: "white",
    fontSize: 16, // Adjusted font size for better readability
  },
  typeButton: {
    backgroundColor: "#1e1e1e", // Consistent button background
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%", // Ensuring full width
    alignItems: "center", // Centering text
  },
  typeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#02a1bd", // Using the blue color for main action button
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  dropdownTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
  pickerContainer: {
    height: 50,
    width: "100%",
    backgroundColor: "#121212",
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#02a1bd",
  },
  pickerStyle: {
    color: "white",
    width: "100%",
  },
  tooltipText: {
    color: "#aaa", // Slightly grayed out
    fontSize: 10, // Smaller text
    marginTop: 0, // Adjust spacing as needed
    textDecorationLine: "underline", // Optional: if you want it to be clear it's tappable
  },
  modalContent: {
    marginTop: 150,
    marginHorizontal: 20,
    backgroundColor: "#333", // Dark background
    padding: 20,
    borderRadius: 5, // Rounded corners for the modal
    shadowColor: "#000", // Optional: if you want to add some shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    color: "#fff", // Light text for readability
    marginBottom: 10, // Spacing between lines
  },
  closeButton: {
    backgroundColor: "#02a1bd", // Use a color that fits your theme
    padding: 10,
    borderRadius: 5,
    marginTop: 20, // Spacing above the button
  },
  testButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    width: "50%",
    alignItems: "center",
  }, 
  successButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "40%",
    alignItems: "center",
  },  
});
