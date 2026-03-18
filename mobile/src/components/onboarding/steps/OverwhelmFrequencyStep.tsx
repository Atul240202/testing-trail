import React, { useState } from 'react';
import { View } from 'react-native';
import QuestionHeader from '../QuestionHeader';
import OptionCard from '../OptionCard';

interface OverwhelmRange {
  id: number;
  label: string;
  min: number;
  max: number;
}

const mockData: OverwhelmRange[] = [
  { id: 1, label: '0 - 1', min: 0, max: 1 },
  { id: 2, label: '2 - 3', min: 2, max: 3 },
  { id: 3, label: '4 - 6', min: 4, max: 6 },
  { id: 4, label: 'Almost every day', min: 7, max: 7 },
];

interface OverwhelmFrequencyStepProps {
  onComplete: (data: OverwhelmRange) => void;
  initialValue?: OverwhelmRange | null;
}

const OverwhelmFrequencyStep: React.FC<OverwhelmFrequencyStepProps> = ({
  onComplete,
  initialValue = null,
}) => {
  const [selectedValue, setSelectedValue] = useState<OverwhelmRange | null>(
    initialValue,
  );

  const handleSelect = (item: OverwhelmRange): void => {
    setSelectedValue(item);
    onComplete(item);
  };

  return (
    <>
      <QuestionHeader
        question="How many times did you feel overwhelmed last week?"
        highlightWord="overwhelmed"
      />

      <View className="mt-12 gap-3">
        {mockData.map(item => (
          <OptionCard
            key={item.id}
            label={item.label}
            isSelected={selectedValue?.id === item.id}
            onPress={() => handleSelect(item)}
          />
        ))}
      </View>
    </>
  );
};

export default OverwhelmFrequencyStep;
