import React from 'react';
import { View } from 'react-native';

interface ProgressDotsProps {
  total: number;
  current: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => {
  return (
    <View className="mb-10 flex-row justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isCompleted = index < current - 1;
        const isCurrent = index === current - 1;

        return (
          <View
            key={index}
            className={`h-2 w-8 rounded-full ${
              isCompleted
                ? 'bg-green-400'
                : isCurrent
                  ? 'bg-indigo-600'
                  : 'bg-gray-300'
            }`}
          />
        );
      })}
    </View>
  );
};

export default ProgressDots;
