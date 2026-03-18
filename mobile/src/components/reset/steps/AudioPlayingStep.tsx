import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, {
  State,
  usePlaybackState,
} from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupPlayer } from '../../../services/playerSetup';

interface Props {
  onEnd: () => void;
}

const AudioPlayingStep = ({ onEnd }: Props) => {
  const playbackState = usePlaybackState();
  const isPaused = playbackState?.state !== 'playing';

  const pulseAnim = useRef(new Animated.Value(0)).current;

  const playStartRef = useRef<number | null>(null);
  const accumulatedDurationRef = useRef<number>(0);

  useEffect(() => {
    const init = async () => {
      const startTime = new Date();
      console.log('Audio STARTED at:', startTime.toISOString());

      await setupPlayer();
      await TrackPlayer.play();

      const existing = await AsyncStorage.getItem('resetSession');
      const parsed = existing ? JSON.parse(existing) : {};

      await AsyncStorage.setItem(
        'resetSession',
        JSON.stringify({
          ...parsed,
          actualAudioStartTime: startTime.toISOString(),
        })
      );
    };

    init();

    return () => {
      TrackPlayer.stop();
      TrackPlayer.reset();
    };
  }, []);

  const handleAutoComplete = useCallback(async () => {
    const endTime = new Date();
    console.log('Audio ENDED at:', endTime.toISOString());


    if (playStartRef.current) {
      const diff =
        Math.floor((Date.now() - playStartRef.current) / 1000);
      accumulatedDurationRef.current += diff;
    }

    const actualDurationSeconds = accumulatedDurationRef.current;
    console.log('Final playing duration:', actualDurationSeconds);

    const existing = await AsyncStorage.getItem('resetSession');
    const parsed = existing ? JSON.parse(existing) : {};

    await AsyncStorage.setItem(
      'resetSession',
      JSON.stringify({
        ...parsed,
        actualAudioEndTime: endTime.toISOString(),
        status: 'auto_completed',
        actualDurationSeconds,
      })
    );

    onEnd();
  }, [onEnd]);

  useEffect(() => {
    if (!playbackState?.state) return;

    console.log('Playback state changed:', playbackState.state);

    if (playbackState.state === 'playing') {
      playStartRef.current = Date.now();
    }

    if (playbackState.state === 'paused') {
      if (playStartRef.current) {
        const diff =
          Math.floor((Date.now() - playStartRef.current) / 1000);

        accumulatedDurationRef.current += diff;
        playStartRef.current = null;

        console.log(
          'Accumulated duration:',
          accumulatedDurationRef.current,
          'seconds'
        );
      }
    }

    if (playbackState.state === State.Ended) {
      handleAutoComplete();
    }
  }, [playbackState, handleAutoComplete]);

  const handlePausePlay = async () => {
    const state = await TrackPlayer.getState();

    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleManualEnd = async () => {
    const endTime = new Date();
    console.log('Manual END at:', endTime.toISOString());

    await TrackPlayer.stop();

    if (playStartRef.current) {
      const diff =
        Math.floor((Date.now() - playStartRef.current) / 1000);
      accumulatedDurationRef.current += diff;
    }

    const actualDurationSeconds = accumulatedDurationRef.current;
    console.log('Manual total playing duration:', actualDurationSeconds);

    const existing = await AsyncStorage.getItem('resetSession');
    const parsed = existing ? JSON.parse(existing) : {};

    await AsyncStorage.setItem(
      'resetSession',
      JSON.stringify({
        ...parsed,
        endTime: endTime.toISOString(),
        status: 'completed',
        actualDurationSeconds,
      })
    );

    onEnd();
  };

  useEffect(() => {
    if (!isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
    }
  }, [isPaused, pulseAnim]);

  const scaleOuter = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const scaleMiddle = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const scaleInner = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.outerCircle,
            { transform: [{ scale: scaleOuter }] },
          ]}
        />
        <Animated.View
          style={[
            styles.middleCircle,
            { transform: [{ scale: scaleMiddle }] },
          ]}
        />
        <Animated.View
          style={[
            styles.innerCircle,
            { transform: [{ scale: scaleInner }] },
          ]}
        >
          <View style={styles.centerDot} />
        </Animated.View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={handlePausePlay}
        >
          {isPaused ? (
            <MaterialCommunityIcons
              name="play"
              size={28}
              color="white"
            />
          ) : (
            <MaterialCommunityIcons
              name="pause"
              size={28}
              color="white"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleManualEnd}>
          <Text style={styles.footerText}>Tap to end</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayingStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07051A',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
  },
  outerCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: '#2A2050',
  },
  middleCircle: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: '#3A2E6E',
  },
  innerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: '#4A3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#6B4AEA',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  pauseButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6B4AEA',
  },
  footerText: {
    color: '#6B7280',
    marginTop: 20,
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
