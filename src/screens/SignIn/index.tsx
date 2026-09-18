import {colors, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '@/ui/Button';
import {useAuthStore} from '@/stores/authStore';
import {useTranslation} from 'react-i18next';

function SignInScreen() {
  const signIn = useAuthStore(s => s.signIn);
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('signIn.title')}</Text>
        <Text style={styles.subtitle}>{t('signIn.subtitle')}</Text>
      </View>
      <View style={styles.footer}>
        <Button text={t('signIn.button')} onPress={signIn} />
      </View>
    </SafeAreaView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
