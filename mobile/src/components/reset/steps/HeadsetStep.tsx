import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  AppState,
  AppStateStatus,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

interface Props {
  onNext: (data: { connected: boolean; action: 'skip' | 'connect' }) => void;
}

const HeadsetStep = ({ onNext }: Props) => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  const checkHeadphoneConnection = React.useCallback(async () => {
    try {
      const connected = await DeviceInfo.isHeadphonesConnected();
      console.log('Headphone connection status:', connected);
  
      if (connected) {
        console.log('Headphones detected. Moving to next step.');
        onNext({ connected: true, action: 'connect' });
      } else {
        console.log('No headphones connected yet.');
      }
    } catch (error) {
      console.log('Error checking headphone connection:', error);
    }
  }, [onNext]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      console.log('AppState changed from', appState, 'to', nextState);

      if (appState.match(/inactive|background/) && nextState === 'active') {
        console.log('App returned to foreground. Checking headphone connection...');
        await checkHeadphoneConnection();
      }

      setAppState(nextState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, checkHeadphoneConnection]);

  const handleConnectBluetooth = async () => {
    console.log('Opening Bluetooth settings...');

    try {
      if (Platform.OS === 'android') {
        await Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
      } else {
        const supported = await Linking.canOpenURL('App-Prefs:root=Bluetooth');
        if (supported) {
          await Linking.openURL('App-Prefs:root=Bluetooth');
        } else {
          await Linking.openSettings();
        }
      }
    } catch (error) {
      console.log('Failed to open Bluetooth settings:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../../../assets/images/headphone.png')}
          style={styles.headphoneImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        For Best Experience, turn{'\n'}on your headset
      </Text>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleConnectBluetooth}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Connect Bluetooth</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log('User chose to continue without headphones');
            onNext({ connected: false, action: 'skip' });
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.secondary}>
            Continue without headphones
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeadsetStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1335',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 40,
  },
  headphoneImage: {
    width: 120,
    height: 120,
  },
  title: {
    color: 'white',
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: '400',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#7C5CE8',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  secondary: {
    color: 'white',
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '400',
  },
});