// app/(tabs)/profil.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import NotificationLocal from '../../components/NotificationLocal';

export default function ProfilPage() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Profil</Text>
            <NotificationLocal />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    title: {
        fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center',
    },
});
