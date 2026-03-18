import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

const PauseButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.85}>
      <Image
        source={require('../assets/images/pause-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default PauseButton;

const styles = StyleSheet.create({
  logo: {
    width: 170,
    height: 170,
  },
});
