import React from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, spacing, radius} from '@/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useWorkouts} from '@/hooks/useWorkouts';
import Button from '@/components/Button';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';

function HistoryScreen() {
  const navigation = useNavigation();

  const {data: workouts, isLoading, isError} = useWorkouts();
  const createWorkout = useCreateWorkout();

  function navigateToWorkout(id: string) {
    navigation.navigate('Workout', {id});
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  }
  if (isLoading)
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  if (isError || !workouts) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Не удалось загрузить тренировки</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Button
        disabled={createWorkout.isPending}
        text="+ Create workout"
        onPress={() => {
          createWorkout.mutate({exercises: 5});
        }}
      />
      <ScrollView>
        {workouts.map(workout => (
          <Pressable
            key={workout.id}
            onPress={() => navigateToWorkout(workout.id)}
            style={({pressed}) => [styles.card, pressed && styles.cardPressed]}>
            <View style={styles.cardContent}>
              <Text style={styles.date}>{formatDate(workout.date)}</Text>
              <Text style={styles.meta}>{workout.exercises} exercises</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  cardPressed: {
    backgroundColor: colors.surfaceElevated,
    transform: [{scale: 0.98}],
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
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
