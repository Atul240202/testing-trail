import TrackPlayer, {
  Event,
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

export const playbackService = async (): Promise<void> => {

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },

    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
    ],

    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
    ],

    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
    ],
  });

  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
  });
};