import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function ContactListMinimal() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  useEffect(() => {
    (async () => {
      // Demande la permission d'accéder aux contacts
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        // Récupère la liste des contacts avec leurs numéros
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
      } else {
        console.log('Permission refusée');
      }
    })();
  }, []);

  // Rendu d'un contact
  const renderContact = ({ item }: { item: Contacts.Contact }) => (
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
        {/* Affiche chaque numéro si disponible */}
        {item.phoneNumbers?.map((phone, index) => (
            <Text key={index} style={styles.phoneNumber}>
              {phone.number}
            </Text>
        ))}
      </View>
  );

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Mes Contacts</Text>
        <FlatList
            data={contacts}
            keyExtractor={(item, index) => item.id ?? index.toString()}
            renderItem={renderContact}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fond noir
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Ligne discrète gris-foncé
    paddingVertical: 10,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  phoneNumber: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
});
