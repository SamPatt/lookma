import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AboutScreen() {
  const navigation = useNavigation();

  const openGitHubRepo = () => {
    const repoUrl = 'https://github.com/SamPatt/lookma';
    Linking.openURL(repoUrl);
  };

  const navigateToTutorial = () => {
    const repoUrl = 'https://youtu.be/DY0rSqmzqNs';
    Linking.openURL(repoUrl);
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <Text style={styles.sectionText}>
          LookMa is an open source, bare-bones React Native app built for Android users as an interface for their locally-run LLMs.
        </Text>

        <Text style={styles.sectionTitle}>License</Text>
        <Text style={styles.sectionText}>
          LookMa is SamPatt licensed, a derivation of the MIT license. License details can be found in the GitHub repository.
        </Text>

        <Text style={styles.sectionTitle}>Development</Text>
        <Text style={styles.sectionText}>
          This app is created by Sam Patterson. You can report bugs, request features, or contribute to the project on GitHub.
        </Text>

        <TouchableOpacity onPress={openGitHubRepo} style={styles.button}>
          <Text style={styles.buttonText}>GitHub repository</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToTutorial} style={[styles.button, styles.tutorialButton]}>
          <Text style={styles.buttonText}>Watch Tutorial</Text>
        </TouchableOpacity>

      </View>
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
  contentContainer: {
    width: '100%',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#02a1bd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    padding: 10,
  },
  tutorialButton: {
    backgroundColor: '#02a1bd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});