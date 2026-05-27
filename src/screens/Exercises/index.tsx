import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '@/theme';

function ExercisesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercises</Text>
      <Text style={styles.subtitle}>Exercises whill show up here</Text>
    </View>
  );
}

export default ExercisesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
