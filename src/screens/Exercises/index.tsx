import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlashList} from '@shopify/flash-list';
import {colors, radius, spacing} from '@/theme';
import {useExercises} from '@/hooks/useExercises';
import type {Exercise} from '@/api/exercises';
import Button from '@/components/Button';
import {useNavigation} from '@react-navigation/native';

function ExercisesScreen() {
  const {data, isLoading, isError} = useExercises();
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load exercises</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: spacing.md}}>
        <Button
          text="+ Add exercise"
          onPress={() => navigation.navigate('EditExercise')}
        />
      </View>
      <FlashList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ExerciseRow exercise={item} />}
        ItemSeparatorComponent={() => <View style={{height: spacing.sm}} />}
        contentContainerStyle={{padding: spacing.md}}
      />
    </SafeAreaView>
  );
}

function ExerciseRow({exercise}: {exercise: Exercise}) {
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
}

export default ExercisesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
  },
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
