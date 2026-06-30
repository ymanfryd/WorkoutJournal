import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '@/theme';
import Button from '@/components/Button';
import {useAuthStore} from '@/stores/authStore';

function SettingsScreen() {
  const signOut = useAuthStore(s => s.signOut);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.signOutWrapper}>
        <Button text="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
}

export default SettingsScreen;

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
  signOutWrapper: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
});
