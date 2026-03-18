import React, { useState } from 'react';
import { View } from 'react-native';
import QuestionHeader from '../QuestionHeader';
import OptionCard from '../OptionCard';

interface ResetTime {
  id: number;
  label: string;
  minutes: number;
  recommended?: boolean;
}

const resetOptions: ResetTime[] = [
  { id: 1, label: '7 minutes', minutes: 7 },
  { id: 2, label: '10 minutes', minutes: 10, recommended: true },
  { id: 3, label: '15 minutes', minutes: 15 },
];

interface ResetDurationStepProps {
  onComplete: (data: ResetTime) => void;
  initialValue?: ResetTime | null;
}

const ResetDurationStep: React.FC<ResetDurationStepProps> = ({
  onComplete,
  initialValue = null,
}) => {
  const [selectedTime, setSelectedTime] = useState<ResetTime | null>(
    initialValue || resetOptions.find(opt => opt.recommended) || null,
  );

  const handleSelect = (option: ResetTime): void => {
    setSelectedTime(option);
    onComplete(option);
  };

  return (
    <>
      <QuestionHeader
        question="What's the maximum time a reset should run ?"
        highlightWord="maximum time"
        subtitle="You can pause anytime by a single tap"
      />

      <View className="gap-4">
        {resetOptions.map(option => (
          <OptionCard
            key={option.id}
            label={option.label}
            isSelected={selectedTime?.id === option.id}
            onPress={() => handleSelect(option)}
            recommended={option.recommended}
          />
        ))}
      </View>
    </>
  );
};

export default ResetDurationStep;
