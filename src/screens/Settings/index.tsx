import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing} from '@/theme';
import Button from '@/ui/Button';
import {useAuthStore} from '@/stores/authStore';
import ScreenLayout from '@/ui/ScreenLayout';
import {useTranslation} from 'react-i18next';
import {useLanguage} from '@/i18n/useLanguage';
import {StaticParamList, useNavigation} from '@react-navigation/native';
import {SettingsStack} from '@/navigation/SettingsStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type SettingsStackParamList = StaticParamList<typeof SettingsStack>;

function SettingsScreen() {
  const signOut = useAuthStore(s => s.signOut);
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const {language, languages} = useLanguage();
  return (
    <ScreenLayout title={t('settings.title')}>
      <View style={styles.container}>
        <Pressable
          style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => navigation.navigate('LanguagePicker')}>
          <Text style={styles.label}>{t('settings.language')}</Text>
          <View style={styles.right}>
            <Text style={styles.value}>
              {languages.find(l => l.code === language)?.label}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.signOutWrapper}>
        <Button text={t('settings.signOut')} onPress={signOut} />
      </View>
    </ScreenLayout>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    color: colors.textMuted,
    fontSize: 15,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 20,
  },
  signOutWrapper: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
});
