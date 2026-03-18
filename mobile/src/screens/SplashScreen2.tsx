/**
 * Splash Screen 2
 * 
 * Second intro screen explaining automatic mind reset feature.
 * Part of the intro flow for first-time users.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ImageBackground } from 'react-native';
import { colors } from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen2 = ({ navigation }: any) => {
    return (
        <ImageBackground
            source={require('../assets/images/mesh_bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={styles.content}>
                <Image
                    source={require('../assets/images/brain.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.title}>
                    Pause helps your{'\n'}mind reset - automatically
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => navigation.navigate('Splash3')}
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
    image: {
        width: 400,
        height: 400,
        marginTop: -100,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Inter_28pt-SemiBold',
        color: colors.textDark,
        textAlign: 'center',
        lineHeight: 36,
        marginTop: -100,
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

export default SplashScreen2;