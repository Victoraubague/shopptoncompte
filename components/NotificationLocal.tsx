// components/NotificationLocal.tsx
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

export default function NotificationLocal() {
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        // Écouter les notifs en premier plan
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notif) => {
                setNotification(notif);
            });

        // Écouter le clic sur la notif
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log('Notification cliquée :', response);
                Alert.alert('Notification cliquée', `Titre : ${response.notification.request.content.title}`);
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

    // Programmer une notification dans 5s
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
            <Text style={styles.title}>Notifications Locales</Text>
            <Button
                title="Programmer une notification (5s)"
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
    container: {
        marginTop: 20,
    },
    title: {
        marginBottom: 20,
        fontSize: 18,
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
