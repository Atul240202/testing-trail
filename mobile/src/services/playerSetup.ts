import TrackPlayer from 'react-native-track-player';

let isInitialized = false;

export const setupPlayer = async () => {
  if (isInitialized) return;

  await TrackPlayer.setupPlayer();

  isInitialized = true;
};