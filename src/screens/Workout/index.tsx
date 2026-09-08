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
import {formatDate} from '@/utils/formatDate';
import {ExerciseCategory} from '@/api/exercises';

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
  category,
  workoutExerciseId,
}: {
  set: WorkoutSet;
  category: ExerciseCategory;
  workoutExerciseId: string;
}) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());
  const {mutate: update} = useUpdateSet();
  const {mutate: removeSet, isPending: setRemoving} = useDeleteSet();

  return (
    <View style={styles.setRow}>
      {category !== 'bodyweight' && (
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
      )}
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
  exerciseCategory,
}: {
  workoutExercise: WorkoutExercise;
  exerciseName: string;
  exerciseCategory: ExerciseCategory;
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
            category={exerciseCategory}
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
          <View style={styles.awHeaderText}>
            <Text style={styles.awMeta}>{formatDate(workout.date)}</Text>
            <Text style={styles.awTitle}>Workout</Text>
          </View>
          <Pressable
            style={({pressed}) => [
              styles.addExerciseButton,
              pressed && styles.addExerciseButtonPressed,
            ]}
            onPress={() => navigation.navigate('PickExercise')}
            hitSlop={8}>
            <Text style={styles.addExerciseButtonText}>+</Text>
          </Pressable>
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
                    key={we.id}
                    workoutExercise={we}
                    exerciseName={ex.name}
                    exerciseCategory={ex.category}
                  />
                );
            })}
        </View>
      </ScrollView>

      <View style={styles.awFooter}>
        <Button
          text="Finish workout"
          color={colors.danger}
          loading={isFinishing}
          disabled={isFinishing || workout.exercises.length === 0}
          onPress={() => finishWorkout()}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  awHeaderText: {
    gap: spacing.xs,
    flex: 1,
  },
  addExerciseButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addExerciseButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  addExerciseButtonText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
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
});
