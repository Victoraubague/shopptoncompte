import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Button, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';

export default function ContactListPage() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const router = useRouter();

  // State pour l'image sélectionnée
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Permission contacts
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      } else {
        console.log('Permission refusée');
      }
    })();
  }, []);

  // Au clic sur un contact, on navigue vers sa page de détail
  const onPressContact = (contact: Contacts.Contact) => {
    if (!contact.id) return;
    router.push({
      pathname: '/(tabs)/contact/[id]',
      params: { id: contact.id },
    });
  };

  // Fonction pour ouvrir la galerie et choisir une image
  async function pickImage() {
    // Demande la permission d’accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Impossible d’accéder à la galerie.');
      return;
    }

    // Ouvre la galerie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Vérifie que l'utilisateur n'a pas annulé
    if (!result.canceled && result.assets?.[0]?.uri) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  // Rendu d'un contact dans la liste
  const renderContact = ({ item }: { item: Contacts.Contact }) => (
      <TouchableOpacity style={styles.item} onPress={() => onPressContact(item)}>
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
  );

  return (
      <View style={styles.container}>

        {/* Titre et liste des contacts */}
        <Text style={styles.title}>Liste des Contacts</Text>
        <FlatList
            data={contacts}
            keyExtractor={(item, index) => item.id ?? index.toString()}
            renderItem={renderContact}
        />

        {/* Section pour choisir une image */}
        <Text style={[styles.title, { marginTop: 30 }]}>Sélection d'image</Text>
        <Button title="Choisir une image" onPress={pickImage} />

        {/* Affichage de l'image sélectionnée */}
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 15,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  name: { fontSize: 18 },
  image: {
    width: 200,
    height: 150,
    marginTop: 10,
    alignSelf: 'center',
  },
});
