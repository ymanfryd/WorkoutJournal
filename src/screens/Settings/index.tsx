import React from 'react';
import {StyleSheet, View} from 'react-native';
import {spacing} from '@/theme';
import Button from '@/ui/Button';
import {useAuthStore} from '@/stores/authStore';
import ScreenLayout from '@/ui/ScreenLayout';

function SettingsScreen() {
  const signOut = useAuthStore(s => s.signOut);
  return (
    <ScreenLayout title="Settings">
      <View style={styles.signOutWrapper}>
        <Button text="Sign Out" onPress={signOut} />
      </View>
    </ScreenLayout>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  signOutWrapper: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
});
