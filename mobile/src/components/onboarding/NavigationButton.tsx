import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface NavigationButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  showIcon?: boolean;
  iconName?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  label,
  onPress,
  disabled = false,
  showIcon = true,
  iconName = 'arrow-right',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center gap-2 rounded-full px-6 py-4 ${
        disabled ? 'bg-gray-300' : 'bg-indigo-600'
      }`}
    >
      <Text className="text-center text-base font-semibold text-white">
        {label}
      </Text>
      {showIcon && (
        <MaterialCommunityIcons name={iconName} size={18} color="#fff" />
      )}
    </TouchableOpacity>
  );
};

export default NavigationButton;
