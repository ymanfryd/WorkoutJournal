import {colors, spacing, radius} from '@/theme';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {
  StaticParamList,
  useNavigation,
  type StaticScreenProps,
} from '@react-navigation/native';
import Button from '@/ui/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDeleteWorkout} from '@/hooks/useDeleteWorkout';
import {HistoryStack} from '@/navigation/HistoryStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useWorkoutById} from '@/hooks/useWorkoutById';
import {formatDate, formatDuration} from '@/utils/formatDate';
import {useExercises} from '@/hooks/useExercises';

type Props = StaticScreenProps<{id: string}>;
type HistoryStackParamList = StaticParamList<typeof HistoryStack>;

function WorkoutDetailScreen({route}: Props) {
  const {id} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();
  const deleteWorkout = useDeleteWorkout();

  const {data: workout, isLoading} = useWorkoutById(route.params.id);
  const {data: exercises} = useExercises();

  function goBack() {
    navigation.popTo('HistoryList');
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <ActivityIndicator color={colors.primary} />}
      {workout && (
        <View style={styles.card}>
          <Text style={styles.title}>{formatDate(workout.date)}</Text>
          <Text style={styles.meta}>
            {workout.exercises.length} exercises ·{' '}
            {formatDuration(workout.duration ?? 0)}
          </Text>
          {workout.exercises.map(we => {
            const exercise = exercises?.find(e => e.id === we.exerciseId);
            if (!exercise) return null;
            return (
              <View key={we.id}>
                <Text style={styles.sectionLabel}>{exercise.name}</Text>
                {we.sets.map(set => {
                  return (
                    <View key={set.id}>
                      <Text style={styles.setDetails}>
                        {set.weight} kg × {set.reps}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}
      <Button text={'Back'} onPress={goBack} />
      <Button
        color={colors.danger}
        disabled={deleteWorkout.isPending}
        text={'Delete workout'}
        onPress={() => {
          deleteWorkout.mutate(id, {onSuccess: goBack});
        }}
      />
    </SafeAreaView>
  );
}

export default WorkoutDetailScreen;

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
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  setDetails: {
    color: colors.text,
    fontSize: 12,
  },
});
