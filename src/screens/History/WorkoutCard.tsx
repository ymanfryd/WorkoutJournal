import {colors, radius, spacing} from '@/theme';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';
import type {Workout} from '@/api/workouts';

const OPEN_POSITION = -100;
const SNAP_THRESHOLD = -50;

type Props = {
  workout: Workout;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
};

const WorkoutCard = ({workout, onPress, onDelete}: Props) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const pan = usePanGesture({
    activeOffsetX: [-10, 10],
    onBegin: () => {
      startX.value = translateX.value;
    },
    onUpdate: e => {
      const next = startX.value + e.translationX;
      translateX.value = Math.min(0, Math.max(OPEN_POSITION, next));
    },
    onFinalize: () => {
      if (translateX.value < SNAP_THRESHOLD) {
        translateX.value = withSpring(OPEN_POSITION);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const tap = useTapGesture({
    onActivate: () => {
      scheduleOnRN(onPress, workout.id);
    },
  });

  const composed = useCompetingGestures(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  }
  return (
    <View style={styles.row}>
      <Pressable style={styles.deleteZone} onPress={() => onDelete(workout.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.cardWrapper, cardStyle]}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.date}>{formatDate(workout.date)}</Text>
              <Text style={styles.meta}>{workout.exercises} exercises</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default WorkoutCard;
const styles = StyleSheet.create({
  row: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius.md,
  },
  deleteZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  cardWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
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
