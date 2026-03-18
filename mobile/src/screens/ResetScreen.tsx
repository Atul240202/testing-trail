import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import HeadsetStep from '../components/reset/steps/HeadsetStep';
import AudioPlayingStep from '../components/reset/steps/AudioPlayingStep';
import ResetBackButton from '../components/reset/ResetBackButton';
// import { startResetSession, endResetSession } from '../api/reset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';

type ResetStep = 'headset' | 'audio' | 'complete';

const ResetScreen = () => {
  const [currentStep, setCurrentStep] = useState<ResetStep>('headset');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const user = useAuthStore(state => state.user);

  // const handleNext = async (data?: {
  //   connected: boolean;
  //   action: 'skip' | 'connect';
  // }) => {
  //   if (!data) return;

  //   if (currentStep === 'headset') {
  //     try {
  //       const now = new Date();
  //       setStartTime(now);

  //       await AsyncStorage.setItem(
  //         'resetSession',
  //         JSON.stringify({
  //           userId: user?._id || null,
  //           startTime: now.toISOString(),
  //           endTime: null,
  //           headsetConnected: data.connected,
  //           status: 'started',
  //           failureReason: null,
  //         })
  //       );

  //       /*
  //       const session = await startResetSession({
  //         startedAt: now.toISOString(),
  //         selectedDurationMinutes: 10,
  //         headphoneConnected: data.connected,
  //         headphoneAction: data.action,
  //       });

  //       setSessionId(session.sessionId);
  //       */

  //       setCurrentStep('audio');

  //     } catch (error: any) {
  //       /*
  //       const errData = error.response?.data;

  //       if (errData?.data?.activeSessionId) {

  //         const activeId = errData.data.activeSessionId;

  //         try {
  //           await endResetSession(activeId, {
  //             endedAt: new Date().toISOString(),
  //             status: 'interrupted',
  //             endedBy: 'user',
  //             actualDurationSeconds: 0,
  //           });

  //         } catch (endError: any) {
  //           console.log("Force end failed:", endError.response?.data || endError);
  //         }
  //       }
  //       */
  //     }
  //   }
  // };


  const handleNext = async (data?: {
    connected: boolean;
    action: 'skip' | 'connect';
  }) => {
    console.log('handleNext called with:', data);
  
    if (!data) return;
  
    if (currentStep === 'headset') {
      console.log('Switching to audio step...');
  
      const now = new Date();
  
      await AsyncStorage.setItem(
        'resetSession',
        JSON.stringify({
          userId: user?._id || null,
          startTime: now.toISOString(),
          endTime: null,
          headsetConnected: data.connected,
          status: 'started',
          failureReason: null,
        })
      );
  
      setCurrentStep('audio');
  
      console.log('Current step set to audio');
    }
  };
  
  const handleBack = async () => {
    if (currentStep === 'audio' && sessionId && startTime) {
      try {
        const endedAt = new Date();

        /*
        await endResetSession(sessionId, {
          endedAt: endedAt.toISOString(),
          status: 'interrupted',
          endedBy: 'user',
          actualDurationSeconds,
        });
        */

        const existing = await AsyncStorage.getItem('resetSession');
        const parsed = existing ? JSON.parse(existing) : {};

        await AsyncStorage.setItem(
          'resetSession',
          JSON.stringify({
            ...parsed,
            endTime: endedAt.toISOString(),
            status: 'interrupted',
            failureReason: 'user_back_pressed',
          })
        );

      } catch (error: any) {
        console.log("Interrupt error:", error.response?.data || error);
      }

      setCurrentStep('headset');
      setSessionId(null);
      setStartTime(null);
    }
  };

  const handleEnd = async () => {
    if (!startTime) return;

    try {
      const endedAt = new Date();

      /*
      await endResetSession(sessionId, {
        endedAt: endedAt.toISOString(),
        status: 'completed',
        endedBy: 'user',
        actualDurationSeconds,
      });
      */

      const existing = await AsyncStorage.getItem('resetSession');
      const parsed = existing ? JSON.parse(existing) : {};

      await AsyncStorage.setItem(
        'resetSession',
        JSON.stringify({
          ...parsed,
          endTime: endedAt.toISOString(),
          status: 'completed',
          failureReason: null,
        })
      );

      setCurrentStep('complete');

    } catch (error) {
      console.error('End reset failed:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'headset':
        return <HeadsetStep onNext={handleNext} />;
      case 'audio':
        return <AudioPlayingStep onEnd={handleEnd} />;
      case 'complete':
        return null;
      default:
        return <HeadsetStep onNext={handleNext} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentStep === 'audio' && (
        <ResetBackButton onPress={handleBack} />
      )}
      <View style={styles.content}>
        {renderStep()}
      </View>
    </SafeAreaView>
  );
};

export default ResetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1335',
  },
  content: {
    flex: 1,
  },
});