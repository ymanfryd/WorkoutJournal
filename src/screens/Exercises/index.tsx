import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {colors, spacing} from '@/theme';
import {useExercises} from '@/hooks/useExercises';
import type {Exercise, MuscleGroup} from '@/api/exercises';
import {useNavigation} from '@react-navigation/native';
import ExerciseRow from './ExerciseRow';
import ScreenLayout from '@/ui/ScreenLayout';
import IconButton from '@/ui/IconButton';

const ORDER: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'core',
];
type Grouped = Partial<Record<MuscleGroup, Exercise[]>>;
export type Row =
  | {type: 'header'; title: string; key: string}
  | {type: 'exercise'; exercise: Exercise; key: string};

const Separator = () => <View style={styles.separator} />;

function ExercisesScreen() {
  const {data, isLoading, isError} = useExercises();
  const navigation = useNavigation();

  const grouped = data?.reduce<Grouped>((acc, ex) => {
    (acc[ex.muscleGroup] ??= []).push(ex);
    return acc;
  }, {});

  const rows: Row[] = ORDER.flatMap(group => {
    const exercises = grouped?.[group];
    if (!exercises?.length) return [];
    return [
      {type: 'header' as const, title: group, key: `header-${group}`},
      ...exercises.map(ex => ({
        type: 'exercise' as const,
        exercise: ex,
        key: `exercise-${ex.id}`,
      })),
    ];
  });
  return (
    <ScreenLayout
      title="Exercises"
      rightSlot={
        <IconButton onPress={() => navigation.navigate('EditExercise')} />
      }>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError || !data ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load exercises</Text>
        </View>
      ) : (
        <FlashList
          data={rows}
          keyExtractor={item => item.key}
          renderItem={({item}) => <ExerciseRow row={item} />}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={{padding: spacing.md}}
        />
      )}
    </ScreenLayout>
  );
}

export default ExercisesScreen;

const styles = StyleSheet.create({
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
  separator: {height: spacing.sm},
});
