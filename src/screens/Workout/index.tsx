import {colors, spacing, radius} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, type StaticScreenProps} from '@react-navigation/native';
import Button from '@/components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDeleteWorkout} from '@/hooks/useDeleteWorkout';

type Props = StaticScreenProps<{id: string}>;

function WorkoutScreen({route}: Props) {
  const {id} = route.params;
  const navigation = useNavigation();
  const deleteWorkout = useDeleteWorkout();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Workout</Text>
        <Text style={styles.id}>#{id}</Text>
      </View>
      <Button
        disabled={deleteWorkout.isPending}
        text={'Delete workout'}
        onPress={() => {
          deleteWorkout.mutate(id, {onSuccess: () => navigation.goBack()});
        }}
      />
      <Button text={'Back'} onPress={navigation.goBack} />
    </SafeAreaView>
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
});
