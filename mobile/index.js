/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import messaging from '@react-native-firebase/messaging';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './src/services/playbackService';


TrackPlayer.registerPlaybackService(() => playbackService);// Register the playback service to handle background events

// Single handler for foreground + background + headless
async function onMessageReceived(remoteMessage) {
    try {
    const data = remoteMessage?.data;
    
    console.log("PAYLOAD:", data);

    if (data?.type === "HEART_RATE_ALERT") {
      const heartRate = Number(data.value);

      if (heartRate >= 100) {
        console.log("Triggering audio");
       try {
            await TrackPlayer.setupPlayer({
              waitForBuffer: true,
            }).catch(() => {});

          await TrackPlayer.reset();

          await TrackPlayer.add({
            id: 'reset-audio',
            url: 'android.resource://com.pausefrontend/raw/reset_40hz_7min',
            title: 'Reset Audio',
            artist: 'Pause App',
          });
          await TrackPlayer.setVolume(1);
          await TrackPlayer.play();

          setTimeout(async () => {
            const state = await TrackPlayer.getState();
            console.log("Playback State After 1s:", state);
          }, 1000);

        } catch (e) {
          console.log("ERROR:", e);
        }
      }
    }
  } catch (e) {
    console.log("ERROR:", e);
  }

}

// Foreground
messaging().onMessage(onMessageReceived);

// Background / Killed
messaging().setBackgroundMessageHandler(onMessageReceived);


// Register headless task for Android background execution
const BackgroundFetchHeadlessTask = async (event) => {
  const taskId = event.taskId;
  const isTimeout = event.timeout;

  if (isTimeout) {
    console.log('[BackgroundFetch] Headless task timeout:', taskId);
    BackgroundFetch.finish(taskId);
    return;
  }

  console.log('[BackgroundFetch] Headless task started:', taskId);

  try {
    // Import worker dynamically to avoid loading entire app
    const { collectAndStoreHealthData } = require('./src/workers/healthDataWorker');
    await collectAndStoreHealthData();
  } catch (error) {
    console.error('[BackgroundFetch] Headless task error:', error);
  }

  BackgroundFetch.finish(taskId);
};

// Register headless task (only if module is available)
if (BackgroundFetch && BackgroundFetch.registerHeadlessTask) {
  BackgroundFetch.registerHeadlessTask(BackgroundFetchHeadlessTask);
} else {
  console.log('[BackgroundFetch] Module not available, skipping headless task registration');
}

AppRegistry.registerComponent(appName, () => App);
