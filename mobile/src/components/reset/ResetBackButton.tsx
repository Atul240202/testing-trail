import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onPress: () => void;
}

const ResetBackButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
        name="arrow-left"
        size={26}
        color="white"
      />
    </TouchableOpacity>
  );
};

export default ResetBackButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
});
