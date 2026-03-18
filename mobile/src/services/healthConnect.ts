import { Alert, Linking, Platform } from 'react-native';
import {
  getSdkStatus,
  SdkAvailabilityStatus,
  initialize,
  requestPermission,
  getGrantedPermissions,
} from 'react-native-health-connect';

const PLAY_STORE_URL =
  'market://details?id=com.google.android.apps.healthdata';

const REQUIRED_TYPES: Array<'Steps' | 'HeartRate'> = [
  'Steps',
  'HeartRate',
];

let initialized = false;
let initializingPromise: Promise<boolean> | null = null;

const ensureInitialized = async (): Promise<boolean> => {
  if (initialized) return true;

  if (!initializingPromise) {
    initializingPromise = initialize().then(result => {
      initialized = result;
      initializingPromise = null;
      return result;
    });
  }

  return initializingPromise;
};

export const handleHealthConnectSync = async (): Promise<boolean> => {
  try {
    if (Platform.OS !== 'android') return false;

    const status = await getSdkStatus();

    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      showInstallAlert('Install', PLAY_STORE_URL);
      return false;
    }

    if (
      status ===
      SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      showInstallAlert('Update', PLAY_STORE_URL);
      return false;
    }

    const isInitialized = await ensureInitialized();
    if (!isInitialized) return false;

    const granted = await getGrantedPermissions();

    const hasAll = REQUIRED_TYPES.every(type =>
      granted.some(p => p.recordType === type)
    );

    if (hasAll) return true;

    const result = await requestPermission(
      REQUIRED_TYPES.map(type => ({
        accessType: 'read',
        recordType: type,
      }))
    );

    return result.length > 0;
  } catch {
    return false;
  }
};

export const isHealthConnectConnected = async (): Promise<boolean> => {
  try {
    if (Platform.OS !== 'android') return false;

    const isInitialized = await ensureInitialized();
    if (!isInitialized) return false;

    const granted = await getGrantedPermissions();

    const hasAll = REQUIRED_TYPES.every(type =>
      granted.some(p => p.recordType === type)
    );

    return hasAll;
  } catch { 
    return false;
  }
};

export const ensureHealthConnectConnected = async (): Promise<void> => {

   const isConnected = await isHealthConnectConnected();
    if (isConnected) return;

    Alert.alert(
      'Health Connect',
      'Health Connect is not connected. Please reconnect to continue syncing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reconnect',
          onPress: async () => {
            await handleHealthConnectSync();
          },
        },
      ]
    );
  };

const showInstallAlert = (text: string, url: string): void => {
  Alert.alert(
    'Health Connect',
    `Please ${text} Health Connect to sync data.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text,
        onPress: () => Linking.openURL(url),
      },
    ]
  );
};
