/**
 * Google Authentication Screen
 * 
 * Handles Google OAuth sign-in flow and user authentication.
 * On successful login, stores token and navigates based on onboarding status.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import GoogleAuthService from '../auth/GoogleAuthService';
import { AUTH_CONFIG } from '../config/auth.config';
import { googleLogin } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const GoogleAuthScreen = () => {
    const [loading, setLoading] = useState(false);
    const { loginSuccess } = useAuthStore();

    useEffect(() => {
        GoogleAuthService.configure(
            AUTH_CONFIG.GOOGLE_WEB_CLIENT_ID,
            AUTH_CONFIG.GOOGLE_IOS_CLIENT_ID
        );
    }, []);

    const handleGoogleSignIn = async () => {
            try {
                setLoading(true);

                const googleUser = await GoogleAuthService.signIn();

                if (!googleUser || !googleUser.email) {
                    throw new Error('Failed to get user information from Google');
                }

                const tokens = await GoogleAuthService.getTokens();
                const idToken = tokens.idToken || '';

                if (!idToken) {
                    throw new Error('Failed to get Google ID token');
                }

                const authData = await googleLogin({ idToken });

                await loginSuccess(authData);
            } catch (error: any) {
                if (error.code === '-5' || error.code === '12501') {
                    return;
                }

                let errorMessage = 'Failed to sign in. Please try again.';

                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                    errorMessage = 'Connection timeout. Please check your internet connection.';
                } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                    errorMessage = 'Network error. Please check your internet connection and API URL.';
                }

                Alert.alert('Sign In Error', errorMessage);
            } finally {
                setLoading(false);
            }
        };

    return (
        <ImageBackground
            source={require('../assets/images/mesh_bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={styles.content}>
                <Text style={styles.title}>
                    Sign in to personalize your resets
                </Text>

                <TouchableOpacity 
                    style={styles.googleButton} 
                    activeOpacity={0.8}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.textDark} />
                    ) : (
                        <>
                            <Image
                                source={require('../assets/images/google.png')}
                                style={styles.googleIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.googleText}>Continue with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.footerText}>Your data is safe with us</Text>
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
    title: {
        fontSize: 22,
        fontFamily: 'Inter_28pt-SemiBold',
        color: colors.textDark,
        marginBottom: 40,
        marginTop: 100,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.googleButtonBorder,
        width: '100%',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    googleText: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Inter_28pt-Medium',
        color: colors.textDark,
    },
    footerText: {
        fontSize: 12,
        fontFamily: 'Inter_28pt-Regular',
        color: colors.textGrey,
        marginTop: 10,
    },
});

export default GoogleAuthScreen;
