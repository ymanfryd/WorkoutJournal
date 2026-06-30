import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {colors, spacing} from '@/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useWorkouts} from '@/hooks/useWorkouts';
import Button from '@/components/Button';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';
import WorkoutCard from './WorkoutCard';
import {useNavigation} from '@react-navigation/native';
import {useDeleteWorkout} from '@/hooks/useDeleteWorkout';

function HistoryScreen() {
  const {data: workouts, isLoading, isError} = useWorkouts();
  const createWorkout = useCreateWorkout();
  const deleteWorkout = useDeleteWorkout();
  const navigation = useNavigation();
  function navigateToWorkout(id: string) {
    navigation.navigate('Workout', {id});
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
          <WorkoutCard
            workout={workout}
            onPress={navigateToWorkout}
            onDelete={deleteWorkout.mutate}
            key={workout.id}
          />
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
