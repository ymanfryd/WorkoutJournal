import {colors, spacing, radius} from '@/theme';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
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
import {useFormatDate, formatDuration} from '@/utils/formatDate';
import {useExercises} from '@/hooks/useExercises';
import {useTranslation} from 'react-i18next';
import {usePlural} from '@/i18n/usePlural';
import MuscleMap from '@/components/MuscleMap';
import {collectWorkoutMuscles} from '@/utils/workoutMuscles';

type Props = StaticScreenProps<{id: string}>;
type HistoryStackParamList = StaticParamList<typeof HistoryStack>;

function WorkoutDetailScreen({route}: Props) {
  const {id} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();
  const deleteWorkout = useDeleteWorkout();
  const formatDate = useFormatDate();
  const {t} = useTranslation();
  const tp = usePlural();

  const {data: workout, isLoading} = useWorkoutById(route.params.id);
  const {data: exercises} = useExercises();
  const muscleSummary =
    workout?.muscleSummary ??
    (workout && exercises ? collectWorkoutMuscles(workout, exercises) : null);
  const hasMuscles = Boolean(
    muscleSummary &&
      (muscleSummary.primaryMuscles.length || muscleSummary.secondaryMuscles.length),
  );

  function goBack() {
    navigation.popTo('HistoryList');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        {isLoading && <ActivityIndicator color={colors.primary} />}
        {workout && (
          <View style={styles.card}>
            <Text style={styles.title}>{formatDate(workout.date)}</Text>
            <Text style={styles.meta}>
              {tp('workout.exercisesCount', workout.exercises.length)} ·{' '}
              {formatDuration(workout.duration ?? 0)}
            </Text>
            {!workout.isActive && muscleSummary && (
              <View style={styles.muscleSummary}>
                <Text style={styles.sectionLabel}>
                  {t('workout.summarySubtitle')}
                </Text>
                <MuscleMap
                  primaryMuscles={muscleSummary.primaryMuscles}
                  secondaryMuscles={muscleSummary.secondaryMuscles}
                />
                {!hasMuscles && (
                  <Text style={styles.emptySummary}>
                    {t('workout.summaryEmpty')}
                  </Text>
                )}
              </View>
            )}
            {workout.exercises.map(we => {
              const exercise = exercises?.find(e => e.id === we.exerciseId);
              if (!exercise) return null;
              return (
                <View key={we.id}>
                  <Text style={styles.sectionLabel}>
                    {t(`exerciseNames.${exercise.id}`, {
                      defaultValue: exercise.name,
                    })}
                  </Text>
                  {we.sets.map(set => (
                    <View key={set.id}>
                      <Text style={styles.setDetails}>
                        {set.weight} kg × {set.reps}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <View style={styles.actions}>
        <Button text={t('common.back')} onPress={goBack} />
        <Button
          color={colors.danger}
          disabled={deleteWorkout.isPending}
          text={t('workoutDetail.deleteButton')}
          onPress={() => {
            deleteWorkout.mutate(id, {onSuccess: goBack});
          }}
        />
      </View>
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
  scrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  actions: {
    gap: spacing.sm,
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
  muscleSummary: {
    gap: spacing.sm,
  },
  emptySummary: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
