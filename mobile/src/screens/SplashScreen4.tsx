/**
 * Splash Screen 4
 * 
 * Final intro screen explaining auto-intervention feature.
 * Marks intro as seen and transitions to authentication flow.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';

const SplashScreen4 = () => {
    const { setBootStatus } = useAuthStore();

    const handleGetStarted = async () => {
        await AsyncStorage.setItem('hasSeenIntro', 'true');
        setBootStatus('unauthenticated');
    };

    return (
        <ImageBackground
            source={require('../assets/images/mesh_bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={styles.content}>
                <Image
                    source={require('../assets/images/wave.png')}
                    style={styles.waveImage}
                    resizeMode="contain"
                />

                <Text style={styles.title}>
                    Pause detects sustained{'\n'}stress and start auto{'\n'}intervention to{'\n'}calm your mind
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color={colors.white} />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    waveImage: {
        width: 500,
        height: 500,
        marginTop: -220,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter_28pt-SemiBold',
        color: colors.textDark,
        textAlign: 'center',
        lineHeight: 34,
        marginTop: -100,
    },
    footer: {
        padding: 30,
        alignItems: 'center',
        marginBottom: 20
    },
    getStartedButton: {
        backgroundColor: colors.primaryPurple,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: colors.primaryPurple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Inter_28pt-SemiBold',
        color: colors.white,
        marginRight: 8,
    },
});

export default SplashScreen4;