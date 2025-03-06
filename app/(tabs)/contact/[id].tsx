import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Switch,
  Button,
  Linking,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export default function ContactDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [contact, setContact] = useState<Contacts.Contact | null>(null);

  const [nickname, setNickname] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
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

  async function sendSMS(phoneNumber: string) {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('SMS non disponible', 'Impossible d’envoyer un SMS.');
      return;
    }
    try {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);
      if (result === 'sent') {
        Alert.alert('SMS envoyé');
      } else if (result === 'cancelled') {
        Alert.alert('Envoi annulé');
      } else {
        Alert.alert('Statut inconnu', `Résultat: ${result}`);
      }
    } catch (error) {
      console.error('Erreur SMS :', error);
      Alert.alert('Erreur lors de l’envoi du SMS.');
    }
  }

  function callNumber(phoneNumber: string) {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
      console.error('Erreur d’appel :', err);
      Alert.alert('Impossible de lancer l’appel.');
    });
  }

  async function pickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Impossible d’accéder à la galerie.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function scheduleNotification() {
    if (!notificationsEnabled) {
      Alert.alert('Notifications désactivées', 'Activez le switch pour recevoir des notifs.');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: nickname || contact?.name || 'Contact',
        body: `Un rappel pour ${nickname || contact?.name} !`,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
    Alert.alert('Notification programmée', 'Elle arrivera dans 5 secondes.');
  }

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

        {/* AVATAR */}
        <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrapper}>
          {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
              <Text style={styles.avatarPlaceholder}>Choisir un avatar</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.info}>Nom : {contact.name}</Text>
        <Text style={styles.label}>Surnom :</Text>
        <TextInput
            style={styles.input}
            placeholder="Entrez un surnom..."
            value={nickname}
            onChangeText={setNickname}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Activer les notifications ?</Text>
          <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
          />
        </View>
        <Button title="Programmer une notif (5s)" onPress={scheduleNotification} />
        <Text style={[styles.label, { marginTop: 20 }]}>Message SMS :</Text>
        <TextInput
            style={styles.input}
            placeholder="Tapez votre message ici..."
            value={message}
            onChangeText={setMessage}
        />

        {contact.phoneNumbers?.map((phone, index) => (
            <View key={index} style={styles.buttonRow}>
              <TouchableOpacity
                  style={styles.buttonSms}
                  onPress={() => phone.number && sendSMS(phone.number)}
              >
                <Text style={styles.buttonText}>SMS à {phone.number}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.buttonCall}
                  onPress={() => phone.number && callNumber(phone.number)}
              >
                <Text style={styles.buttonText}>Appeler</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center',
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 60,
    width: 120,
    height: 120,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120, height: 120, borderRadius: 60,
  },
  avatarPlaceholder: {
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  info: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  label: {
    fontSize: 16,
    marginVertical: 6,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 8, fontSize: 16, marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  buttonSms: {
    flex: 1,
    marginRight: 5,
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  buttonCall: {
    flex: 1,
    marginLeft: 5,
    padding: 12,
    backgroundColor: '#2ecc71',
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  goBack: {
    marginTop: 30, padding: 12, backgroundColor: '#999', borderRadius: 6,
  },
  goBackText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
