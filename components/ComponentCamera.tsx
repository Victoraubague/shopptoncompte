import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
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
        <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Sélection d'image</Text>
            <Button title="Choisir une image" onPress={pickImage} />
            {selectedImage && (
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 200, height: 150, marginTop: 10 }}
                />
            )}
        </View>
    );
}
