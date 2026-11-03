import {Exercise} from '@/api/exercises';
import CardWithGesture from '@/components/CardWithGesture';
import {useDeleteExercise} from '@/hooks/useDeleteExercise';
import {colors, radius, spacing} from '@/theme';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import MuscleMap from '@/components/MuscleMap';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {Workout} from '@/api/workouts';
import {getWorkingWeight} from '@/utils/workingWeight';
import WorkingWeightModal from '@/components/WorkingWeightModal';
import {useState} from 'react';

const Card = ({
  exercise,
  workingWeight,
}: {
  exercise: Exercise;
  workingWeight?: number;
}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.name}>
            {t(`exerciseNames.${exercise.id}`, {defaultValue: exercise.name})}
          </Text>
          <Text style={styles.muscleGroup}>
            {t(`muscleGroups.${exercise.muscleGroup}`)}
          </Text>
          {workingWeight !== undefined && (
            <Text style={styles.workingWeight}>
              {t('workingWeight.current', {weight: workingWeight})}
            </Text>
          )}
        </View>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>
            {t(`categories.${exercise.category}`)}
          </Text>
        </View>
      </View>
      <MuscleMap
        primaryMuscles={exercise.primaryMuscles}
        secondaryMuscles={exercise.secondaryMuscles}
      />
    </View>
  );
};
function ExerciseCard({
  exercise,
  workouts,
}: {
  exercise: Exercise;
  workouts: Workout[];
}) {
  const {mutate: deleteExerciseMutation} = useDeleteExercise();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const workingWeight = getWorkingWeight(exercise, workouts);
  const navigation = useNavigation<
    NativeStackNavigationProp<{EditExercise: {id?: string}}>
  >();

  function onDelete() {
    deleteExerciseMutation(exercise.id);
  }

  const card = exercise.isCustom ? (
    <CardWithGesture
      id={exercise.id}
      onPress={id => navigation.navigate('EditExercise', {id})}
      onDelete={onDelete}>
      <Card exercise={exercise} workingWeight={workingWeight} />
    </CardWithGesture>
  ) : (
    <Pressable onPress={() => setShowWeightModal(true)}>
      <Card exercise={exercise} workingWeight={workingWeight} />
    </Pressable>
  );
  return (
    <>
      {card}
      <WorkingWeightModal
        exercise={exercise}
        visible={showWeightModal}
        value={workingWeight}
        onClose={() => setShowWeightModal(false)}
      />
    </>
  );
}

export default ExerciseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContent: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  muscleGroup: {
    color: colors.textMuted,
    fontSize: 12,
  },
  workingWeight: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChip: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  categoryText: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
