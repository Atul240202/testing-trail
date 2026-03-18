import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QuestionHeader from '../QuestionHeader';
import TimePickerModal from '../TimePickerModal';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface WorkHoursStepProps {
  onComplete: (data: TimeSlot) => void;
  initialValue?: TimeSlot;
}

const WorkHoursStep: React.FC<WorkHoursStepProps> = ({
  onComplete,
  initialValue = { startTime: '9:00 AM', endTime: '6:00 PM' },
}) => {
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(initialValue);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleTimeChange = (field: 'startTime' | 'endTime', time: string) => {
    const newTimeSlot = { ...timeSlot, [field]: time };
    setTimeSlot(newTimeSlot);
    onComplete(newTimeSlot);
  };

  return (
    <>
      <QuestionHeader
        question="What are your usual work hours?"
        highlightWord="work hours"
        subtitle="Pause will be extra cautious during this time"
      />

      <View className="gap-6">
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-500">
            Start time
          </Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3"
          >
            <Text className="text-base font-medium text-black">
              {timeSlot.startTime}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text className="mb-2 text-sm font-medium text-gray-500">
            End time
          </Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3"
          >
            <Text className="text-base font-medium text-black">
              {timeSlot.endTime}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TimePickerModal
        visible={showStartPicker}
        onClose={() => setShowStartPicker(false)}
        onSelect={time => handleTimeChange('startTime', time)}
      />
      <TimePickerModal
        visible={showEndPicker}
        onClose={() => setShowEndPicker(false)}
        onSelect={time => handleTimeChange('endTime', time)}
      />
    </>
  );
};

export default WorkHoursStep;
