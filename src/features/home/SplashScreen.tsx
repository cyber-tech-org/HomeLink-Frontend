import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '../../components/ThemedText';

export default function SplashScreen() {
    const navigation = useNavigation<any>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('SignUp');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    {/* Placeholder Logo */}
                    <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

                    <ThemedText style={styles.title}>
                        Home Scout
                    </ThemedText>

                    <ThemedText style={styles.subtitle}>
                        CONNECTING YOU TO YOUR IDEAL HOME.
                    </ThemedText>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: 96,
        height: 96,
        marginBottom: 24,
    },
    title: {
        color: '#0061FF', // primary
        fontFamily: 'Rubik_700Bold', // font-rubik-bold
        fontSize: 30, // text-3xl
        letterSpacing: 0.05 * 30, // tracking-wider
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    subtitle: {
        color: '#8C8E98', // gray
        fontFamily: 'Rubik_500Medium', // font-rubik-medium
        fontSize: 12, // text-xs
        textAlign: 'center',
        letterSpacing: 0.1 * 12, // tracking-widest
    },
});
