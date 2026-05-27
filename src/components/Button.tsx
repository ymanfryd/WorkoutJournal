import {colors, radius, spacing} from '@/theme';
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

function Button({onPress, text}: {onPress: () => void; text: string}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{color: colors.surfaceElevated}}
      style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    width: '100%',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
