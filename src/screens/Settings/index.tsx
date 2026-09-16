import React from 'react';
import {StyleSheet, View} from 'react-native';
import {spacing} from '@/theme';
import Button from '@/ui/Button';
import {useAuthStore} from '@/stores/authStore';
import ScreenLayout from '@/ui/ScreenLayout';
import {useTranslation} from 'react-i18next';

function SettingsScreen() {
  const signOut = useAuthStore(s => s.signOut);
  const {t} = useTranslation();
  return (
    <ScreenLayout title={t('settings.title')}>
      <View style={styles.signOutWrapper}>
        <Button text={t('settings.signOut')} onPress={signOut} />
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
