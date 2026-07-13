import Button from '@/components/Button';
import {colors, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import {useActiveWorkout} from '@/hooks/useActiveWorkout';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';
import {Workout} from '@/api/workouts';

function ActiveWorkout({workout}: {workout: Workout}) {
  function formatWorkoutHeader(ts: number) {
    const date = new Date(ts);
    const time = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const today = new Date();
    const isSameDay = date.toDateString() === today.toDateString();
    const dayLabel = isSameDay
      ? 'Today'
      : date.toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'});
    return `${dayLabel}, ${time}`;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.workoutSubtitle}>
          {formatWorkoutHeader(workout.date)}
        </Text>
        <Text style={styles.workoutTitle}>Exercises</Text>
        <Text style={styles.workoutSubtitle}>
          {workout.exercises.length} exercises
        </Text>
      </View>
    </View>
  );
}

function WorkoutScreen() {
  const activeWorkout = useActiveWorkout();
  const createWorkout = useCreateWorkout();

  async function onPress() {
    await createWorkout.mutateAsync();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>
      {activeWorkout.data ? (
        <ActiveWorkout workout={activeWorkout.data} />
      ) : (
        <Button
          loading={createWorkout.isPending || activeWorkout.isLoading}
          text={'Create empty workout'}
          onPress={onPress}
        />
      )}
    </View>
  );
}

export default WorkoutScreen;

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
  workoutTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  workoutSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
