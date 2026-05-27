import {colors, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '@/components/Button';
import {useAuth} from '@/auth/AuthContext';

function SignInScreen() {
  const {signIn} = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Workout Journal</Text>
        <Text style={styles.subtitle}>Track your progress</Text>
      </View>
      <View style={styles.footer}>
        <Button text="Sign In" onPress={signIn} />
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
