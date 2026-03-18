import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <View className="flex-row items-center px-6 py-4">
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons name="chevron-left" size={32} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
