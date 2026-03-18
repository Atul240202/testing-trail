import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  label: string;
  onPress: () => void;
  iconName?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const ResetNavigationButton = ({
  label,
  onPress,
  iconName,
  disabled = false,
  style,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>

      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color="white"
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default ResetNavigationButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
