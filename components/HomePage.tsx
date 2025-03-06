// components/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';

export default function HomePage() {
    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });
                setContacts(data);
            } else {
                console.log('Permission refusée');
            }
        })();
    }, []);

    function handlePress(contact: Contacts.Contact) {
        if (!contact.id) return;
        router.push({
            pathname: '/(tabs)/contact/[id]',
            params: { id: contact.id },
        });
    }

    const renderItem = ({ item }: { item: Contacts.Contact }) => (
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Text style={styles.contactName}>{item.name}</Text>
            {item.phoneNumbers?.[0] && (
                <Text style={styles.phone}>{item.phoneNumbers[0].number}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer un Profil</Text>
            <Text style={styles.subtitle}>
                Sélectionnez un contact pour personnaliser son profil.
            </Text>

            <FlatList
                data={contacts}
                keyExtractor={(item, index) => item.id ?? index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 6,
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 30,
    },
    card: {
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 8,
        padding: 16,
        // Ombre légère
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2, // Pour Android
    },
    contactName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: '#555',
    },
});
