import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const TutorialScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <WebView
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: "https://www.youtube.com/embed/KPDlo5jrhmI" }}
            />
            <Button
                title="Skip"
                onPress={() => navigation.replace('Home')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    webView: {
        marginTop: 20,
        maxHeight: 200,
        width: 320,
        marginBottom: 20,
    },
});

export default TutorialScreen;