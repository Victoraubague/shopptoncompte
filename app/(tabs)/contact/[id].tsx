import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';

export default function ContactDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contacts.Contact | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      if (!id) return;
      try {
        const result = await Contacts.getContactByIdAsync(id.toString());
        if (result) {
          setContact(result);
        }
      } catch (error) {
        console.log('Erreur lors de la récupération du contact :', error);
      }
    };
    fetchContact();
  }, [id]);

  const sendSMS = async (phoneNumber: string) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'sa marche pas ici'
      );
      return;
    }

    try {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);
      if (result === 'sent') {
        Alert.alert('1');
      } else if (result === 'cancelled') {
        Alert.alert('2');
      } else {
        Alert.alert('Statut inconnu', `Résultat: ${result}`);
      }
    } catch (error) {
      console.error('3', error);
      Alert.alert('3');
    }
  };

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement du contact...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail du Contact</Text>
      <Text style={styles.info}>Nom : {contact.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Tapez votre message ici..."
        value={message}
        onChangeText={setMessage}
      />

      {contact.phoneNumbers?.map((phone, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => phone.number && sendSMS(phone.number)}
        >
          <Text style={styles.buttonText}>
            Envoyer un SMS à {phone.number}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.goBack} onPress={() => router.back()}>
        <Text style={styles.goBackText}>Retour</Text>
      </TouchableOpacity>
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
  info: { fontSize: 18, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  goBack: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#999',
    borderRadius: 6,
  },
  goBackText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
