import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, radius, spacing} from '@/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useActiveWorkout} from '@/hooks/useActiveWorkout';

function ActiveWorkoutScreen() {
  const {data} = useActiveWorkout();
  const navigation = useNavigation();

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
    <SafeAreaView style={styles.container}>
      <View style={styles.closeContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({pressed}) => [styles.close, pressed && styles.closePressed]}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        {data ? (
          <View>
            <Text style={styles.workoutSubtitle}>
              {formatWorkoutHeader(data.date)}
            </Text>
            <Text style={styles.workoutTitle}>Exercises</Text>
            <Text style={styles.workoutSubtitle}>
              {data.exercises.length || 0} exercises
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No active workout</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ActiveWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  close: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  closePressed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  closeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  workoutHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
