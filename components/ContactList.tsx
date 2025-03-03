import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';


import SendSMSButton from './SendSMSButton';

export default function ContactList() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      } else {
        console.log('Permission refusée');
      }
    })();
  }, []);

  const renderContact = ({ item }: { item: Contacts.Contact }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      {item.phoneNumbers?.map((phone, index) =>
        phone.number ? (
          <SendSMSButton key={index} phoneNumber={phone.number} />
        ) : null
      )}
    </View>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
});
