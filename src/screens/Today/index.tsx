import {colors, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';

function TodayScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.subtitle}>Active training whill show up here</Text>
    </View>
  );
}

export default TodayScreen;

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
