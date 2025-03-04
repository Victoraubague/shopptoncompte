import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Platform.select({
                    ios: { position: 'absolute' },
                    default: {},
                }),
            }}
        >
            {/* Onglet Home */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />

            {/* Onglet Profil */}
            <Tabs.Screen
                name="profil"
                options={{
                    title: 'Profil',
                }}
            />
        </Tabs>
    );
}
