import {colors, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import type {Workout} from '@/api/workouts';
import CardWithGesture from '@/components/CardWithGesture';

type Props = {
  workout: Workout;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
  deletePending: boolean;
};

const WorkoutCard = ({workout, onPress, onDelete, deletePending}: Props) => {
  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  }
  return (
    <CardWithGesture
      id={workout.id}
      onPress={onPress}
      onDelete={onDelete}
      deletePending={deletePending}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.date}>{formatDate(workout.date)}</Text>
          <Text style={styles.meta}>{workout.exercises.length} exercises</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </CardWithGesture>
  );
};

export default WorkoutCard;
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  cardContent: {
    gap: spacing.xs,
  },
  date: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 24,
  },
});
