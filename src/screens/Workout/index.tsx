import Button from '@/ui/Button';
import ScreenLayout from '@/ui/ScreenLayout';
import {colors, radius, spacing} from '@/theme';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import {useActiveWorkout} from '@/hooks/useActiveWorkout';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';
import {
  getExercises,
  type Exercise,
  type ExerciseCategory,
} from '@/api/exercises';
import {
  Workout,
  WorkoutExercise,
  WorkoutMuscleSummary,
  WorkoutSet,
  deleteEmptyActiveWorkout,
} from '@/api/workouts';
import {useNavigation} from '@react-navigation/native';
import {useExercises} from '@/hooks/useExercises';
import CardWithGesture from '@/components/CardWithGesture';
import {useState} from 'react';
import {useUpdateSet} from '@/hooks/useUpdateSet';
import {useAddSet} from '@/hooks/useAddSet';
import {useDeleteExerciseFromWorkout} from '@/hooks/useDeleteExerciseFromWorkout';
import {useFinishWorkout} from '@/hooks/useFinishWorkout';
import {useDeleteSet} from '@/hooks/useDeleteSet';
import {useFormatDate} from '@/utils/formatDate';
import RestTimer from '@/components/RestTimer';
import IconButton from '@/ui/IconButton';
import {useTranslation} from 'react-i18next';
import {usePlural} from '@/i18n/usePlural';
import {useQueryClient} from '@tanstack/react-query';
import MuscleMap from '@/components/MuscleMap';
import type {MuscleId} from '@/data/muscles';
import {
  collectWorkoutMuscles,
} from '@/utils/workoutMuscles';

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
      onSubmitEditing={Keyboard.dismiss}
      returnKeyType="done"
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
  const {t} = useTranslation();

  return (
    <View style={styles.setRow}>
      {category !== 'bodyweight' && (
        <InputRow
          label={t('workout.weight')}
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
        label={t('workout.reps')}
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
      <Pressable
        disabled={setRemoving}
        onPress={() => {
          removeSet({workoutExerciseId, setId: set.id});
        }}>
        {setRemoving ? (
          <ActivityIndicator color={colors.textMuted} />
        ) : (
          <Text style={styles.awExerciseMeta}>{t('workout.remove')}</Text>
        )}
      </Pressable>
    </View>
  );
}

function WorkoutExerciseCard({
  workoutExercise,
  exerciseId,
  exerciseName,
  exerciseCategory,
  primaryMuscles,
  secondaryMuscles,
}: {
  workoutExercise: WorkoutExercise;
  exerciseId: string;
  exerciseName: string;
  exerciseCategory: ExerciseCategory;
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
}) {
  const {mutate: addSet, isPending: isAdding} = useAddSet();
  const {mutate: deleteExercise, isPending: isDeleting} =
    useDeleteExerciseFromWorkout();
  const {t} = useTranslation();
  const tp = usePlural();

  return (
    <CardWithGesture
      id={workoutExercise.id}
      onPress={() => {}}
      deletePending={isDeleting}
      onDelete={() => deleteExercise(workoutExercise.id)}>
      <View style={styles.awExerciseCard}>
        <Text style={styles.awExerciseName}>
          {t(`exerciseNames.${exerciseId}`, {defaultValue: exerciseName})}
        </Text>
        <Text style={styles.awExerciseMeta}>
          {tp('workout.sets', workoutExercise.sets.length)}
        </Text>
        <MuscleMap
          primaryMuscles={primaryMuscles}
          secondaryMuscles={secondaryMuscles}
        />

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
            <Text style={styles.addSetText}>{t('workout.addSet')}</Text>
          )}
        </Pressable>
      </View>
    </CardWithGesture>
  );
}

const REST_PRESETS = [60, 90, 120];

function ActiveWorkoutBody({
  workout,
  onFinishPress,
  onAddExercise,
}: {
  workout: Workout;
  onFinishPress: () => void;
  onAddExercise: () => void;
}) {
  const {data: exercises, isLoading} = useExercises();
  const [restDuration, setRestDuration] = useState<number | null>(null);
  const {t} = useTranslation();

  return (
    <View style={styles.awBody}>
      <ScrollView
        contentContainerStyle={styles.awContent}
        keyboardDismissMode="interactive"
      >
        <View style={styles.awSection}>
          <Text style={styles.awSectionLabel}>
            {t('workout.exercisesLabel')}
          </Text>

          {isLoading && <ActivityIndicator color={colors.primary} />}

          {!isLoading && workout.exercises.length === 0 && (
            <Text style={styles.awEmpty}>{t('workout.noExercises')}</Text>
          )}

          {!isLoading &&
            workout.exercises.map(we => {
              const ex = exercises?.find(e => e.id === we.exerciseId);
              if (ex)
                return (
                  <WorkoutExerciseCard
                    key={we.id}
                    workoutExercise={we}
                    exerciseId={ex.id}
                    exerciseName={ex.name}
                    exerciseCategory={ex.category}
                    primaryMuscles={ex.primaryMuscles}
                    secondaryMuscles={ex.secondaryMuscles}
                  />
                );
            })}
        </View>
      </ScrollView>

      <View style={styles.awFooter}>
        {restDuration ? (
          <RestTimer
            duration={restDuration}
            onComplete={() => setRestDuration(null)}
            onCancel={() => setRestDuration(null)}
          />
        ) : (
          <View style={styles.restPresets}>
            <Text style={styles.restPresetsLabel}>
              {t('workout.restLabel')}
            </Text>
            {REST_PRESETS.map(seconds => (
              <Pressable
                key={seconds}
                onPress={() => setRestDuration(seconds)}
                style={({pressed}) => [
                  styles.restPreset,
                  pressed && styles.restPresetPressed,
                ]}>
                <Text style={styles.restPresetText}>{seconds}s</Text>
              </Pressable>
            ))}
          </View>
        )}
        <Button
          text={t('workout.addExercise')}
          onPress={onAddExercise}
        />
      </View>
    </View>
  );
}

function CloseButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({pressed}) => [
        styles.closeButton,
        pressed && styles.closeButtonPressed,
      ]}>
      <Text style={styles.closeButtonText}>×</Text>
    </Pressable>
  );
}

function FinishWorkoutModal({
  visible,
  onConfirm,
  onClose,
  isPending,
}: {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const {t} = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Pressable
            style={styles.modalClose}
            onPress={onClose}
            hitSlop={8}>
            <Text style={styles.modalCloseText}>×</Text>
          </Pressable>
          <Text style={styles.modalTitle}>
            {t('workout.finishWorkoutTitle')}
          </Text>
          <Text style={styles.modalSubtitle}>
            {t('workout.finishWorkoutSubtitle')}
          </Text>
          <Button
            text={t('common.yes')}
            color={colors.danger}
            loading={isPending}
            onPress={onConfirm}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

function WorkoutSummaryModal({
  visible,
  onClose,
  primaryMuscles,
  secondaryMuscles,
}: WorkoutMuscleSummary & {
  visible: boolean;
  onClose: () => void;
}) {
  const {t} = useTranslation();
  const hasMuscles = primaryMuscles.length > 0 || secondaryMuscles.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.summaryOverlay}>
        <View style={styles.summaryContent}>
          <ScrollView
            style={styles.summaryScroll}
            contentContainerStyle={styles.summaryScrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.summaryTitle}>{t('workout.summaryTitle')}</Text>
            <Text style={styles.summarySubtitle}>
              {t('workout.summarySubtitle')}
            </Text>
            <MuscleMap
              primaryMuscles={primaryMuscles}
              secondaryMuscles={secondaryMuscles}
            />
            {!hasMuscles && (
              <Text style={styles.summaryEmpty}>
                {t('workout.summaryEmpty')}
              </Text>
            )}
          </ScrollView>
          <Button text={t('common.close')} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function WorkoutScreen() {
  const activeWorkout = useActiveWorkout();
  const createWorkout = useCreateWorkout();
  const {data: exerciseCatalog} = useExercises();
  const formatDate = useFormatDate();
  const {t} = useTranslation();

  const workout = activeWorkout.data;
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  const [isPreparingFinish, setIsPreparingFinish] = useState(false);
  const [workoutMuscleSummary, setWorkoutMuscleSummary] =
    useState<WorkoutMuscleSummary>({primaryMuscles: [], secondaryMuscles: []});
  const {mutateAsync: finishWorkout, isPending: isFinishing} = useFinishWorkout();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const confirmFinish = async () => {
    if (!workout) return;
    setIsPreparingFinish(true);
    try {
      let muscles: WorkoutMuscleSummary | undefined;
      try {
        const catalog: Exercise[] =
          exerciseCatalog ??
          (await queryClient.ensureQueryData<Exercise[]>({
            queryKey: ['exercises'],
            queryFn: getExercises,
          }));
        muscles = collectWorkoutMuscles(workout, catalog);
      } catch {
        // Finishing should remain possible if the optional exercise catalog fails.
      }
      await finishWorkout(muscles);
      setWorkoutMuscleSummary(
        muscles ?? {primaryMuscles: [], secondaryMuscles: []},
      );
      setShowFinishModal(false);
      setShowWorkoutSummary(true);
    } catch {
      // Keep the confirmation open so the user can retry.
    } finally {
      setIsPreparingFinish(false);
    }
  };

  const handleFinish = async () => {
    if (workout && workout.exercises.length === 0) {
      // Empty workout — delete without confirmation
      await deleteEmptyActiveWorkout();
      queryClient.invalidateQueries({queryKey: ['workouts']});
      queryClient.invalidateQueries({queryKey: ['activeWorkout']});
    } else {
      setShowFinishModal(true);
    }
  };

  return (
    <ScreenLayout
      title={t('workout.title')}
      subtitle={workout ? formatDate(workout.date) : undefined}
      rightSlot={
        workout ? (
          <CloseButton onPress={handleFinish} />
        ) : undefined
      }>
      {workout ? (
        <ActiveWorkoutBody
          workout={workout}
          onFinishPress={handleFinish}
          onAddExercise={() => navigation.navigate('PickExercise')}
        />
      ) : (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>{t('workout.emptyTitle')}</Text>
          <Text style={styles.emptySubtitle}>{t('workout.emptySubtitle')}</Text>
          <Button
            loading={createWorkout.isPending || activeWorkout.isLoading}
            text={t('workout.startButton')}
            onPress={() => createWorkout.mutateAsync()}
          />
        </View>
      )}

      <FinishWorkoutModal
        visible={showFinishModal}
        onConfirm={confirmFinish}
        onClose={() => setShowFinishModal(false)}
        isPending={isFinishing || isPreparingFinish}
      />
      <WorkoutSummaryModal
        visible={showWorkoutSummary}
        onClose={() => setShowWorkoutSummary(false)}
        {...workoutMuscleSummary}
      />
    </ScreenLayout>
  );
}

export default WorkoutScreen;

const styles = StyleSheet.create({
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
  awBody: {
    flex: 1,
  },
  awContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
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
    gap: spacing.sm,
  },
  restPresets: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  restPresetsLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginRight: 'auto',
  },
  restPreset: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  restPresetPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  restPresetText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  closeButtonText: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '80%',
    gap: spacing.md,
  },
  modalClose: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  modalCloseText: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '600',
  },
  summaryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  summaryContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    width: '100%',
    maxWidth: 460,
    maxHeight: '92%',
    gap: spacing.sm,
  },
  summaryScroll: {
    flexShrink: 1,
  },
  summaryScrollContent: {
    gap: spacing.sm,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  summarySubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  summaryEmpty: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
