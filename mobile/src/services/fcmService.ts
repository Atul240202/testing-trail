import messaging from '@react-native-firebase/messaging';
import apiClient from '../api/client';

export const registerFcmToken = async (): Promise<void> => {
  try {

    const token = await messaging().getToken();
    
    await apiClient.post("/users/fcm-token", {
      fcmToken: token
    });

  } catch (error) {
    console.error("FCM register error:", error);
  }
};

export const listenFcmTokenRefresh = () => {
  return messaging().onTokenRefresh(async token => {
    try {
      await apiClient.post("/users/fcm-token", {
        fcmToken: token
      });
    } catch (error) {
      console.error("FCM refresh error:", error);
    }
  });
};