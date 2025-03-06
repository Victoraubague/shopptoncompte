// components/ImagePickerComponent.tsx
import React, { useState } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerComponent() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission refusée', 'Impossible d’accéder à la galerie.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            setSelectedImage(result.assets[0].uri);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sélection d'image</Text>
            <Button title="Choisir une image" onPress={pickImage} />
            {selectedImage && (
                <Image
                    source={{ uri: selectedImage }}
                    style={styles.image}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 150,
        marginTop: 10,
        alignSelf: 'center',
    },
});
