import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/lookma_loading.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // or any other background color
  },
  image: {
    width: 320, // Set your desired width
    height: 560, // Set your desired height
    resizeMode: 'contain', // or 'cover' depending on your preference
  },
});

export default LoadingScreen;
