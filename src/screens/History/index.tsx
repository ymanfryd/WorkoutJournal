import React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {colors, spacing} from '@/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useWorkouts} from '@/hooks/useWorkouts';
import WorkoutCard from './WorkoutCard';
import {StaticParamList, useNavigation} from '@react-navigation/native';
import {useDeleteWorkout} from '@/hooks/useDeleteWorkout';
import {FlashList} from '@shopify/flash-list';
import {Workout} from '@/api/workouts';
import {HistoryStack} from '@/navigation/HistoryStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type HistoryStackParamList = StaticParamList<typeof HistoryStack>;

function HistoryScreen() {
  const {data: workouts, isLoading, isError} = useWorkouts();
  const {mutate: deleteWorkoutMutation, isPending: deletePending} =
    useDeleteWorkout();
  const navigation =
    useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();

  function navigateToWorkout(id: string) {
    navigation.navigate('WorkoutDetail', {id});
  }

  function onDelete(id: string) {
    deleteWorkoutMutation(id);
  }

  function renderItem({item}: {item: Workout}) {
    return (
      <WorkoutCard
        deletePending={deletePending}
        workout={item}
        onPress={navigateToWorkout}
        onDelete={onDelete}
      />
    );
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
      <FlashList
        drawDistance={800}
        data={workouts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
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
