import Button from '@/components/Button';
import {colors, radius, spacing} from '@/theme';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {useActiveWorkout} from '@/hooks/useActiveWorkout';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';
import {Workout} from '@/api/workouts';
import {useNavigation} from '@react-navigation/native';
import {useExercises} from '@/hooks/useExercises';

function formatWorkoutHeader(ts: number): string {
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

function ActiveWorkout({workout}: {workout: Workout}) {
  const navigation = useNavigation();
  const {data: exercises, isLoading} = useExercises();

  return (
    <View style={styles.awContainer}>
      <ScrollView contentContainerStyle={styles.awContent}>
        <View style={styles.awHeader}>
          <Text style={styles.awMeta}>{formatWorkoutHeader(workout.date)}</Text>
          <Text style={styles.awTitle}>Workout</Text>
        </View>

        <View style={styles.awSection}>
          <Text style={styles.awSectionLabel}>Exercises</Text>

          {isLoading && <ActivityIndicator color={colors.primary} />}

          {!isLoading && workout.exercises.length === 0 && (
            <Text style={styles.awEmpty}>No exercises yet</Text>
          )}

          {!isLoading &&
            workout.exercises.map(we => {
              const ex = exercises?.find(e => e.id === we.exerciseId);
              return (
                <View key={we.id} style={styles.awExerciseCard}>
                  <Text style={styles.awExerciseName}>
                    {ex?.name ?? 'Unknown'}
                  </Text>
                  <Text style={styles.awExerciseMeta}>
                    {we.sets.length} sets
                  </Text>
                </View>
              );
            })}
        </View>
      </ScrollView>

      <View style={styles.awFooter}>
        <Button
          text="+ Add exercise"
          onPress={() => navigation.navigate('PickExercise')}
        />
      </View>
    </View>
  );
}

function WorkoutScreen() {
  const activeWorkout = useActiveWorkout();
  const createWorkout = useCreateWorkout();

  return (
    <View style={styles.container}>
      {activeWorkout.data ? (
        <ActiveWorkout workout={activeWorkout.data} />
      ) : (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>Ready to train?</Text>
          <Text style={styles.emptySubtitle}>
            Start an empty workout and add exercises as you go
          </Text>
          <Button
            loading={createWorkout.isPending || activeWorkout.isLoading}
            text="Start empty workout"
            onPress={() => createWorkout.mutateAsync()}
          />
        </View>
      )}
    </View>
  );
}

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  emptyBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  awContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  awContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  awHeader: {
    gap: spacing.xs,
  },
  awMeta: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  awTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },

  awSection: {
    gap: spacing.sm,
  },
  awSectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },

  awEmpty: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },

  awExerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  awExerciseName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  awExerciseMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },

  awFooter: {
    padding: spacing.md,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.background,
  },
});
