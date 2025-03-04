import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';



Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function ProfilScreen() {
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notif) => {
                setNotification(notif);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log('Notification cliquée :', response);
                Alert.alert(
                    'Notification cliquée',
                    `Titre : ${response.notification.request.content.title}`
                );
            });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    async function scheduleLocalNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Hello 👋',
                body: 'Ceci est une notification locale !',
            },
            trigger: {
                type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
            },
        });
        Alert.alert('Notification programmée', 'Elle apparaîtra dans 5 secondes.');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil & Notifications Locales</Text>

            <Button
                title="Programmer une notification locale (5s)"
                onPress={scheduleLocalNotification}
            />

            {notification && (
                <View style={styles.notificationBox}>
                    <Text style={styles.label}>Notification reçue en premier plan :</Text>
                    <Text style={styles.text}>Titre : {notification.request.content.title}</Text>
                    <Text style={styles.text}>Body : {notification.request.content.body}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: {
        marginBottom: 20,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    notificationBox: {
        marginTop: 20,
        padding: 15,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
});
