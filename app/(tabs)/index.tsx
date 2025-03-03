import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';

export default function ContactListPage() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
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

  const onPressContact = (contact: Contacts.Contact) => {
    if (!contact.id) return;
    router.push({
      pathname: '/(tabs)/contact/[id]',
      params: { id: contact.id },
    });
  };

  const renderContact = ({ item }: { item: Contacts.Contact }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPressContact(item)}
    >
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={renderContact}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: {
    padding: 15,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  name: { fontSize: 18 },
});
