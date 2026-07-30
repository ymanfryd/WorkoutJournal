import {useAddExerciseToWorkout} from '@/hooks/useAddExerciseToWorkout';
import {useExercises} from '@/hooks/useExercises';
import {colors, radius, spacing} from '@/theme';
import {FlashList} from '@shopify/flash-list';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PickExercise = () => {
  const {data, isLoading} = useExercises();
  const {mutate} = useAddExerciseToWorkout();
  const navigation = useNavigation();
  if (isLoading) return <ActivityIndicator />;
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.closeContainer}
        onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.title}>Pick exercise</Text>
      </View>
      <FlashList
        data={data}
        renderItem={({item}) => (
          <Pressable
            style={styles.pickRow}
            onPress={() =>
              mutate(item.id, {onSuccess: () => navigation.goBack()})
            }>
            <Text style={styles.pickRowName}>{item.name}</Text>
            <Text style={styles.pickRowMeta}>{item.muscleGroup}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default PickExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  pickRow: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  pickRowName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  pickRowMeta: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
