/**
 * Splash Screen 3
 * 
 * Third intro screen explaining how Pause helps bring back focus during stress.
 * Part of the intro flow for first-time users.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { colors } from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen3 = ({ navigation }: any) => {
    return (
        <ImageBackground
            source={require('../assets/images/mesh_bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={styles.content}>
                <Text style={styles.title}>
                    Your brain doesn't stop{'\n'}when you are stressed
                </Text>
                <Text style={styles.subtitle}>
                    Pause gently brings it back
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => navigation.navigate('Splash4')}
                >
                    <Text style={styles.nextText}>Next</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color={colors.primaryPurple} />
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
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Inter_28pt-SemiBold',
        color: colors.textDark,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 26,
        fontFamily: 'Inter_28pt-SemiBold',
        color: colors.primaryPurple,
        textAlign: 'center',
        lineHeight: 36,
    },
    footer: {
        padding: 30,
        alignItems: 'flex-end',
        marginBottom: 20
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Inter_28pt-SemiBold',
        color: colors.primaryPurple,
        marginRight: 8,
    },
});

export default SplashScreen3;