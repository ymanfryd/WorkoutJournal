import {colors, spacing, radius} from '@/theme';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, type StaticScreenProps} from '@react-navigation/native';

type Props = StaticScreenProps<{id: string}>;

function WorkoutScreen({route}: Props) {
  const {id} = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Workout</Text>
        <Text style={styles.id}>#{id}</Text>
      </View>

      <Pressable
        onPress={() => navigation.goBack()}
        android_ripple={{color: colors.surfaceElevated}}
        style={({pressed}) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  id: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.85,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
