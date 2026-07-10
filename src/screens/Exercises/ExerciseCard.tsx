import {Exercise} from '@/api/exercises';
import CardWithGesture from '@/components/CardWithGesture';
import {useDeleteExercise} from '@/hooks/useDeleteExercise';
import {colors, radius, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';

const Card = ({exercise}: {exercise: Exercise}) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowContent}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
      </View>
      <View style={styles.categoryChip}>
        <Text style={styles.categoryText}>{exercise.category}</Text>
      </View>
    </View>
  );
};
function ExerciseCard({exercise}: {exercise: Exercise}) {
  const {mutate: deleteExerciseMutation} = useDeleteExercise();

  function onDelete() {
    deleteExerciseMutation(exercise.id);
  }

  return exercise.isCustom ? (
    <CardWithGesture id={exercise.id} onPress={() => {}} onDelete={onDelete}>
      <Card exercise={exercise} />
    </CardWithGesture>
  ) : (
    <Card exercise={exercise} />
  );
}

export default ExerciseCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
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
    textTransform: 'capitalize',
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
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
});
