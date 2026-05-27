import React from 'react';
import {Text, Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, spacing, radius} from '@/theme';
import {SafeAreaView} from 'react-native-safe-area-context';

function HistoryScreen() {
  const navigation = useNavigation();
  const workouts = [
    {id: '5', date: Date.now(), exercises: 15},
    {id: '4', date: Date.now() - 1 * 24 * 60 * 60 * 1000, exercises: 6},
    {id: '3', date: Date.now() - 3 * 24 * 60 * 60 * 1000, exercises: 8},
    {id: '2', date: Date.now() - 7 * 24 * 60 * 60 * 1000, exercises: 5},
    {id: '1', date: Date.now() - 14 * 24 * 60 * 60 * 1000, exercises: 3},
  ];

  function navigateToWorkout(id: string) {
    navigation.navigate('Workout', {id});
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  }

  return (
    <SafeAreaView style={styles.container}>
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
});
