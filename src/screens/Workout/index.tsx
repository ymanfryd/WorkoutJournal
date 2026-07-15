import Button from '@/components/Button';
import {colors, radius, spacing} from '@/theme';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import {useActiveWorkout} from '@/hooks/useActiveWorkout';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';
import {Workout, WorkoutExercise, WorkoutSet} from '@/api/workouts';
import {useNavigation} from '@react-navigation/native';
import {useExercises} from '@/hooks/useExercises';
import CardWithGesture from '@/components/CardWithGesture';
import {useState} from 'react';
import {useUpdateSet} from '@/hooks/useUpdateSet';
import {useAddSet} from '@/hooks/useAddSet';
import {useDeleteExerciseFromWorkout} from '@/hooks/useDeleteExerciseFromWorkout';
import {useFinishWorkout} from '@/hooks/useFinishWorkout';
import {useDeleteSet} from '@/hooks/useDeleteSet';

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

const InputRow = ({
  label,
  value,
  setValue,
  onEndEditing,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  onEndEditing: () => void;
}) => (
  <>
    <Text style={styles.awExerciseMeta}>{label}</Text>

    <TextInput
      value={value}
      selectTextOnFocus
      style={styles.setInput}
      onChangeText={setValue}
      onEndEditing={onEndEditing}
      keyboardType="numeric"
    />
  </>
);

function SetRow({
  set,
  workoutExerciseId,
}: {
  set: WorkoutSet;
  workoutExerciseId: string;
}) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());
  const {mutate: update} = useUpdateSet();
  const {mutate: removeSet, isPending: setRemoving} = useDeleteSet();

  return (
    <View style={styles.setRow}>
      <InputRow
        label={'Weight'}
        value={weight}
        setValue={setWeight}
        onEndEditing={() =>
          update({
            workoutExerciseId,
            setId: set.id,
            patch: {weight: parseInt(weight, 10) || 0},
          })
        }
      />
      <InputRow
        label={'Reps'}
        value={reps}
        setValue={setReps}
        onEndEditing={() =>
          update({
            workoutExerciseId,
            setId: set.id,
            patch: {reps: parseInt(reps, 10) || 0},
          })
        }
      />
      {
        <Pressable
          disabled={setRemoving}
          onPress={() => {
            removeSet({workoutExerciseId, setId: set.id});
          }}>
          {setRemoving ? (
            <ActivityIndicator color={colors.textMuted} />
          ) : (
            <Text style={styles.awExerciseMeta}>{'Remove'}</Text>
          )}
        </Pressable>
      }
    </View>
  );
}

function WorkoutExerciseCard({
  workoutExercise,
  exerciseName,
}: {
  workoutExercise: WorkoutExercise;
  exerciseName: string;
}) {
  const {mutate: addSet, isPending: isAdding} = useAddSet();
  const {mutate: deleteExercise, isPending: isDeleting} =
    useDeleteExerciseFromWorkout();

  return (
    <CardWithGesture
      id={workoutExercise.id}
      onPress={() => {}}
      deletePending={isDeleting}
      onDelete={() => deleteExercise(workoutExercise.id)}>
      <View style={styles.awExerciseCard}>
        <Text style={styles.awExerciseName}>{exerciseName}</Text>
        <Text style={styles.awExerciseMeta}>
          {workoutExercise.sets.length} sets
        </Text>

        {workoutExercise.sets.map(set => (
          <SetRow
            key={set.id}
            set={set}
            workoutExerciseId={workoutExercise.id}
          />
        ))}

        <Pressable
          style={styles.addSetButton}
          disabled={isAdding}
          onPress={() => addSet(workoutExercise.id)}>
          {isAdding ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.addSetText}>+ Add Set</Text>
          )}
        </Pressable>
      </View>
    </CardWithGesture>
  );
}

function ActiveWorkout({workout}: {workout: Workout}) {
  const navigation = useNavigation();
  const {data: exercises, isLoading} = useExercises();
  const {mutate: finishWorkout, isPending: isFinishing} = useFinishWorkout();

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
              if (ex)
                return (
                  <WorkoutExerciseCard
                    workoutExercise={we}
                    exerciseName={ex.name}
                  />
                );
            })}
          <Pressable
            style={styles.addSetButton}
            disabled={isFinishing}
            onPress={() => finishWorkout()}>
            {isFinishing ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.addSetText}>Finish workout</Text>
            )}
          </Pressable>
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
  addSetButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.sm,
  },
  addSetText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  setNumber: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    width: 24,
  },
  setInput: {
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    fontSize: 14,
    minWidth: 60,
    textAlign: 'center',
  },
  setNonEditable: {
    backgroundColor: 'transparent',
    color: colors.textMuted,
  },
  setInputCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  setDelete: {
    padding: spacing.xs,
  },
  setDeleteText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '600',
  },
});
