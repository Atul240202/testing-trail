/**
 * Onboarding Screen
 * 
 * Multi-step onboarding flow for new users to configure their preferences.
 * Collects overwhelm frequency, work hours, reset duration, and device pairing.
 * On completion, marks onboarding as complete and navigates to main app.
 */

import React, { JSX, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressDots from '../components/onboarding/ProgressDots';
import NavigationButton from '../components/onboarding/NavigationButton';
import BackButton from '../components/onboarding/BackButton';
import OverwhelmFrequencyStep from '../components/onboarding/steps/OverwhelmFrequencyStep';
import WorkHoursStep from '../components/onboarding/steps/WorkHoursStep';
import ResetDurationStep from '../components/onboarding/steps/ResetDurationStep';
import DevicePairingStep from '../components/onboarding/steps/DevicePairingStep';
import { useAuthStore } from '../store/authStore';

interface OnboardingData {
  overwhelmFrequency?: any;
  workHours?: any;
  resetDuration?: any;
  pairedDevice?: any;
}

const TOTAL_STEPS = 4;
const DEVICE_PAIRING_STEP = 4;

function OnboardingScreen(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({});
  const { completeOnboarding } = useAuthStore();

  const getStepKey = (step: number): keyof OnboardingData => {
    const stepKeys: Record<number, keyof OnboardingData> = {
      1: 'overwhelmFrequency',
      2: 'workHours',
      3: 'resetDuration',
      4: 'pairedDevice',
    };
    return stepKeys[step];
  };

  const buildResponsesPayloadFromData = (sourceData: OnboardingData) => {
    const responses: any[] = [];

    if (sourceData.overwhelmFrequency) {
      responses.push({
        id: "overwhelm_frequency",
        answers: [
          {
            label: sourceData.overwhelmFrequency.label,
            min: sourceData.overwhelmFrequency.min,
            max: sourceData.overwhelmFrequency.max,
          }
        ]
      });
    }

    if (sourceData.workHours) {
      responses.push({
        id: "work_hours",
        answers: [
          {
            label: `${sourceData.workHours.startTime} - ${sourceData.workHours.endTime}`,
            min: sourceData.workHours.startTime,
            max: sourceData.workHours.endTime,
          }
        ]
      });
    }

    if (sourceData.resetDuration) {
      responses.push({
        id: "max_reset_time",
        answers: [
          {
            label: sourceData.resetDuration.label,
            min: 0,
            max: sourceData.resetDuration.minutes,
          }
        ]
      });
    }

    return responses;
  };

  const handleStepComplete = async (stepData: any) => {
    const updatedData = {
      ...data,
      [getStepKey(currentStep)]: stepData,
    };

    setData(updatedData);

    if (currentStep === DEVICE_PAIRING_STEP) {
      try {
        const responses = buildResponsesPayloadFromData(updatedData);
        await completeOnboarding(responses);
      } catch (error) {
        if (__DEV__) {
          console.error('Onboarding completion error:', error);
        }
      }
    }
  };

  const handleNext = async (): Promise<void> => {

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        const responses = buildResponsesPayloadFromData(data);
        await completeOnboarding(responses);
      } catch (error) {
        if (__DEV__) {
          console.error('Onboarding completion error:', error);
        }
      }
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = (): boolean => {
    if (currentStep === 1) return !!data.overwhelmFrequency;
    if (currentStep === 2) return !!data.workHours;
    if (currentStep === 3) return !!data.resetDuration;
    if (currentStep === 4) return true;
    return false;
  };

  const renderStep = () => {
    const stepComponents = {
      1: OverwhelmFrequencyStep,
      2: WorkHoursStep,
      3: ResetDurationStep,
      4: DevicePairingStep,
    };

    const StepComponent = stepComponents[currentStep as keyof typeof stepComponents];

    if (!StepComponent) return null;

    return (
      <StepComponent
        onComplete={handleStepComplete}
        initialValue={data[getStepKey(currentStep)]}
      />
    );
  };

  const getButtonLabel = (): string => {
    if (currentStep === 1) return 'Next';
    if (currentStep === 2) return 'Next';
    if (currentStep === 3) return 'Set up Pause';
    return 'Complete Setup';
  };

  const getButtonIcon = (): string => {
    if (currentStep === 1) return 'arrow-right';
    if (currentStep === 2) return 'arrow-right';
    if (currentStep === 3) return 'check';
    return 'check';
  };

  const isDevicePairingStep = currentStep === DEVICE_PAIRING_STEP;
  const showBackButton = currentStep > 1 && !isDevicePairingStep;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {showBackButton && <BackButton onPress={handleBack} />}

      {isDevicePairingStep ? (
        <View className="flex-1 items-center justify-center px-6">
          {renderStep()}
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={currentStep === 1 ? { paddingTop: 64 } : {}}
          showsVerticalScrollIndicator={false}
        >
          <ProgressDots total={TOTAL_STEPS} current={currentStep} />
          {renderStep()}
        </ScrollView>
      )}

      {!isDevicePairingStep && (
        <View className="px-6 py-4">
          <NavigationButton
            label={getButtonLabel()}
            onPress={handleNext}
            disabled={!isStepValid()}
            showIcon={currentStep !== 3}
            iconName={getButtonIcon()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default OnboardingScreen;
