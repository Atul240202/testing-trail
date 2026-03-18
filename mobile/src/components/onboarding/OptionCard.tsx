import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface OptionCardProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  recommended?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
  label,
  isSelected,
  onPress,
  recommended = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`relative flex-row items-center justify-center rounded-3xl border-2 px-5 py-4 ${
        isSelected
          ? 'border-orange-400 bg-orange-50'
          : 'border-gray-300 bg-white'
      }`}
    >
      <Text
        className={`text-center text-base font-medium ${
          isSelected ? 'font-bold text-black' : 'text-gray-700'
        }`}
      >
        {label}
      </Text>
      {recommended && (
        <View 
          className="absolute right-4 rounded-full bg-green-500 px-3 py-1"
        >
          <Text className="text-xs font-semibold uppercase text-white">
            Recommended
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OptionCard;
