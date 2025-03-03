import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as SMS from 'expo-sms';

type SendSMSButtonProps = {
  phoneNumber: string;
};

export default function SendSMSButton({ phoneNumber }: SendSMSButtonProps) {
  const sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Fonctionnalité non disponible',
        'L’envoi de SMS n’est pas supporté sur cet appareil.'
      );
      return;
    }

    try {
      const { result } = await SMS.sendSMSAsync(
        [phoneNumber],
        'test message'
      );
      if (result === 'sent') {
        Alert.alert('Succès', 'Message envoyé avec succès.');
      } else if (result === 'cancelled') {
        Alert.alert('Annulé', "L'envoi du message a été annulé.");
      } else {
        Alert.alert('Statut inconnu', `Résultat: ${result}`);
      }
    } catch (error) {
      console.error('Erreur lors de l’envoi du SMS:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l’envoi du SMS.');
    }
  };

  return (
    <TouchableOpacity onPress={sendSMS} style={styles.phoneButton}>
      <Text style={styles.phone}>{phoneNumber}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  phoneButton: {
    paddingVertical: 5,
  },
  phone: {
    fontSize: 16,
    color: '#555',
  },
});
